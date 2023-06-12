import { NextRouter } from 'next/router';
import { resetAll } from '../rootAction';
import { RootState } from '../rootReducer';
import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { auth } from '@/config/firebase';
import { IUser, User } from '@/models/user';
import storageUtil, { StorageKey } from '@/utils/storage.util';

interface UserSliceState {
  data: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  data: null,
  loading: false,
  error: null
};

export const customersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = new User(action.payload);
      storageUtil.saveItem({ key: StorageKey.user, value: user })
      state.data = action.payload ? user : null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState)
  }
});

export const { setUser } = customersSlice.actions;


export const logout = createAsyncThunk(
  'user/logout',
  (router: NextRouter, { dispatch }) => {
    router.push('/login')
    setTimeout(() => {
      auth.signOut()
      storageUtil.deleteItem(StorageKey.user)
      dispatch(resetAll())
    }, 2000);
  }
)

// Selectors for accessing data from the state
export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Export the slice reducer
export default customersSlice.reducer;