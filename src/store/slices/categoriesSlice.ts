import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { fetchFirestoreData } from '@/utils/firebase.util';
import { resetAll } from '../rootAction';
import { Category, CategoryType, ICategory } from '@/models/category';

interface CategoriesSliceState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesSliceState = {
  data: [],
  loading: false,
  error: null
};

export const CategoriesSlice = createSlice({
  name: 'Categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload ? action.payload.map((category: ICategory) => new Category(category)) : [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload?.map((category: ICategory) => new Category(category));
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching categories data';
      })
      .addCase(resetAll, () => initialState);
  }
});

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  (userID: string) => {
    return fetchFirestoreData(`Users/${userID}/Categories`)
  }
)

export const { setCategories } = CategoriesSlice.actions;

// Selectors for accessing data from the state
export const selectCategories = (state: RootState) => state.categories.data;
export const selectExpenseCategories = (state: RootState) => state.categories.data.filter((category: Category) => category.type === CategoryType.EXPENSE);
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategoriesError = (state: RootState) => state.categories.error;

// Export the slice reducer
export default CategoriesSlice.reducer;