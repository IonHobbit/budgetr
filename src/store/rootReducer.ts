import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import usersReducer from './slices/usersSlice';
import budgetsReducer from './slices/budgetsSlice';
import accountsReducer from './slices/accountsSlice';
import categoriesReducer from './slices/categoriesSlice';

export type RootState = {
  user: ReturnType<typeof userReducer>;
  users: ReturnType<typeof usersReducer>;
  budgets: ReturnType<typeof budgetsReducer>;
  accounts: ReturnType<typeof accountsReducer>;
  categories: ReturnType<typeof categoriesReducer>;
};

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  budgets: budgetsReducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
});

export default rootReducer;