import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';

const persistConfig = {
  key: 'budgetr::state',
  storage,
  whitelist: ['user', 'accounts', 'categories']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(thunkMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store);