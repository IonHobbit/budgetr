import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import accountsReducer from './slices/accountsSlice';
import categoriesReducer from './slices/categoriesSlice';
import budgetsReducer from './slices/budgetsSlice';

export type RootState = {
  user: ReturnType<typeof userReducer>;
  accounts: ReturnType<typeof accountsReducer>;
  categories: ReturnType<typeof categoriesReducer>;
  budgets: ReturnType<typeof budgetsReducer>;
};

const rootReducer = combineReducers({
  user: userReducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
  budgets: budgetsReducer,
});

export default rootReducer;