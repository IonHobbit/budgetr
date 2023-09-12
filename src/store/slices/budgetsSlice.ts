import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { fetchFirestoreData, subscribeToFirestoreCollection } from '@/utils/firebase.util';
import { resetAll } from '../rootAction';
import { Budget, IBudget } from '@/models/budget';
import getStoredState from 'redux-persist/es/getStoredState';

interface BudgetsSliceState {
  data: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetsSliceState = {
  data: [],
  loading: false,
  error: null
};

export const BudgetsSlice = createSlice({
  name: 'Budgets',
  initialState,
  reducers: {
    setBudgets: (state, action) => {
      state.data = action.payload ? action.payload.map((budget: IBudget) => new Budget(budget)) : [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToBudgets.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(subscribeToBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching budgets data';
      })
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload?.map((budget: IBudget) => new Budget(budget));
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching budgets data';
      })
      .addCase(resetAll, () => initialState);
  }
});

export const fetchBudgets = createAsyncThunk(
  'Budgets/fetchBudgets',
  (userID: string) => {
    return fetchFirestoreData(`Users/${userID}/Budgets`)
  }
)

export const subscribeToBudgets = createAsyncThunk(
  'Budgets/subscribe',
  (_, thunkAPI) => {
    try {
      const { user: { data } } = thunkAPI.getState() as RootState;
      return subscribeToFirestoreCollection(`Users/${data?.id}/Budgets`, thunkAPI.dispatch, setBudgets)
    } catch (error) {
      thunkAPI.rejectWithValue(error)
    }
  }
)

export const { setBudgets } = BudgetsSlice.actions;

// Selectors for accessing data from the state
export const selectBudgetsState = (state: RootState) => state.budgets;
export const selectBudgets = (state: RootState) => state.budgets.data;
export const selectBudgetsLoading = (state: RootState) => state.budgets.loading;
export const selectBudgetsError = (state: RootState) => state.budgets.error;

// Export the slice reducer
export default BudgetsSlice.reducer;