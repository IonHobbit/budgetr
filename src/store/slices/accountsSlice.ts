import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { fetchFirestoreData, generateCollectionReference, subscribeToFirestoreCollection } from '@/utils/firebase.util';
import { resetAll } from '../rootAction';
import { Account, IAccount, IBank } from '@/models/account';
import { EncrpytedData, ITransaction, Transaction, TransactionType } from '@/models/transaction';
import helperUtil from '@/utils/helper.util';
import { decryptDataWithKey } from '@/utils/encryption.util';
import { onSnapshot } from 'firebase/firestore';

interface AccountsSliceState {
  data: Account[];
  banks: IBank[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsSliceState = {
  data: [],
  banks: [],
  loading: false,
  error: null
};

export const AccountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.data = action.payload?.map((account: IAccount) => new Account(account));
      state.loading = false;
      state.error = null;
    },
    setBanks: (state, action) => {
      state.banks = action.payload ?? [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload?.map((account: IAccount) => new Account(account));
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching accounts data';
      })
      .addCase(resetAll, () => initialState);
  }
});

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (userID: string, thunkAPI) => {
    try {
      const response = await fetchFirestoreData(`Users/${userID}/Accounts`)
      const accounts = await Promise.all(
        response!.map(async (account: IAccount) => {
          const transactionResponse = await fetchFirestoreData(`Users/${userID}/Accounts/${account.id}/Transactions`)
          const transactions = transactionResponse
            ?.map((transaction: EncrpytedData) => {
              const data = decryptDataWithKey(userID, transaction.data!) as object
              delete transaction.data;

              return new Transaction({ ...transaction, ...data } as unknown as ITransaction, account)
            })
            .sort((a: Transaction, b: Transaction) => helperUtil.timestampToDateConverter(b.date).getTime() - helperUtil.timestampToDateConverter(a.date).getTime()) || [];
          const expenses = transactions
            .filter(
              (transaction: Transaction) =>
                transaction.type == TransactionType.EXPENSE
            );
          const income = transactions
            .filter(
              (transaction: Transaction) =>
                transaction.type == TransactionType.INCOME
            )
          const transfers = transactions
            .filter(
              (transaction: Transaction) =>
                transaction.type == TransactionType.TRANSFER
            )
          const totals = {
            expenses: expenses
              .reduce((sum: number, transaction: Transaction) => {
                return +sum + +transaction.amount;
              }, 0),
            income: income
              .reduce((sum: number, transaction: Transaction) => {
                return +sum + +transaction.amount;
              }, 0),
            transfers: transfers
              .reduce((sum: number, transaction: Transaction) => {
                return +sum + +transaction.amount;
              }, 0),
          }

          return { ...account, transactions, expenses, income, transfers, totals }
        })
      )
      return accounts.sort((a, b) => helperUtil.timestampToDateConverter(b.timestamp).getTime() - helperUtil.timestampToDateConverter(a.timestamp).getTime());
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)


export const subscribeToAccounts = createAsyncThunk(
  'accounts/subscribe',
  (_, thunkAPI) => {
    const { user: { data } } = thunkAPI.getState() as RootState;
    const accountsCollectionReference = generateCollectionReference(`Users/${data?.id}/Accounts`)
    const unsubscribeTransactionListeners = [];
    
    
    const unsubscribeFromAccounts = onSnapshot(accountsCollectionReference,
      (snapshot) => {
        const _accounts: Account[] = [];
        snapshot.docChanges().forEach((change) => {
          const _account = { ...change.doc.data(), id: change.doc.id } as IAccount;
          console.log(_account);

          const transactionCollectionReference = generateCollectionReference(`Users/${data?.id}/Accounts/${_account.id}/Transactions`)
          const unsubscribeFromTransactions = onSnapshot(transactionCollectionReference,
            (transactionSnapshot) => {
              const _transactions: Transaction[] = transactionSnapshot.docChanges().map((transactionChange) => {
                const encryptedData = { ...transactionChange.doc.data(), id: transactionChange.doc.id } as EncrpytedData;
                const decryptedData = decryptDataWithKey(data!.id, encryptedData.data!) as object
                delete encryptedData.data

                return new Transaction({ ...encryptedData, ...decryptedData } as unknown as ITransaction, _account)
              })
              const expenses = _transactions
                .filter(
                  (transaction: Transaction) =>
                    transaction.type == TransactionType.EXPENSE
                );
              const income = _transactions
                .filter(
                  (transaction: Transaction) =>
                    transaction.type == TransactionType.INCOME
                )
              const transfers = _transactions
                .filter(
                  (transaction: Transaction) =>
                    transaction.type == TransactionType.TRANSFER
                )
              const totals = {
                expenses: expenses
                  .reduce((sum: number, transaction: Transaction) => {
                    return +sum + +transaction.amount;
                  }, 0),
                income: income
                  .reduce((sum: number, transaction: Transaction) => {
                    return +sum + +transaction.amount;
                  }, 0),
                transfers: transfers
                  .reduce((sum: number, transaction: Transaction) => {
                    return +sum + +transaction.amount;
                  }, 0),
              }
              _accounts.push(new Account({ ..._account, transactions: _transactions, expenses, income, transfers, totals }))
              setAccounts(_accounts);
            })
          unsubscribeTransactionListeners.push(unsubscribeFromTransactions);
        })
      })
  }
)


export const { setBanks, setAccounts } = AccountsSlice.actions;

// Selectors for accessing data from the state
export const selectAccountsState = (state: RootState) => state.accounts;
export const selectBanks = (state: RootState) => state.accounts.banks || [];
export const selectAccounts = (state: RootState) => state.accounts.data;
export const selectAccountsLoading = (state: RootState) => state.accounts.loading;
export const selectAccountsError = (state: RootState) => state.accounts.error;

// Export the slice reducer
export default AccountsSlice.reducer;