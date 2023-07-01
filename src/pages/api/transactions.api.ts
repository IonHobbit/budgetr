import { CreateTransactionRequest } from "@/interfaces/requests.interface"
import { Account } from "@/models/account"
import { TransactionType } from "@/models/transaction"
import { encryptDataWithKey } from "@/utils/encryption.util"
import { updateFirestoreDocument, writeToFirestore } from "@/utils/firebase.util"
import notification from "@/utils/notification"

const areFundsSufficient = (account: Account, amount: number) => {
  return account.balance >= amount
}

export const recordTransaction = async (userID: string, account: Account, transaction: CreateTransactionRequest) => {
  const transactionPayload = Object.assign({}, transaction) as any;
  if (transaction.receivingAccount) {
    transactionPayload.receivingAccount = transaction.receivingAccount?.id
  }

  if ((transaction.type == TransactionType.EXPENSE || transaction.type == TransactionType.TRANSFER) &&
    !areFundsSufficient(account, transaction.amount)) {
    notification.error('Account balance too low for that transaction. Are you sure it happened?')
    return false
  }

  const response = await writeToFirestore(`Users/${userID}/Accounts/${account.id}/Transactions`, { data: encryptDataWithKey(userID, transactionPayload) })

  if (transaction.type == TransactionType.EXPENSE) {
    await debitAccount(userID, account, transaction.amount)
  } else if (transaction.type == TransactionType.INCOME) {
    await creditAccount(userID, account, transaction.amount)
  } else if (transaction.type == TransactionType.TRANSFER) {
    await debitAccount(userID, account, transaction.amount)
    await creditAccount(userID, transaction.receivingAccount!, transaction.amount)
  }
  return response
}

export const creditAccount = async (userID: string, account: Account, amount: number) => {
  const balance = +account.balance + +amount;
  const response = await updateFirestoreDocument(`Users/${userID}/Accounts/${account.id}`, { balance })
  return response;
}

export const debitAccount = async (userID: string, account: Account, amount: number) => {
  const balance = account.balance - amount;
  const response = await updateFirestoreDocument(`Users/${userID}/Accounts/${account.id}`, { balance })
  return response;
}