import { NextRouter } from 'next/router';
import { resetAll } from '../rootAction';
import { RootState } from '../rootReducer';
import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { auth } from '@/config/firebase';
import { IUser, User } from '@/models/user';
import storageUtil, { StorageKey } from '@/utils/storage.util';
import { subscribeToFirestoreCollection, subscribeToFirestoreDocument } from '@/utils/firebase.util';
import { INotification, Notification } from '@/models/notification';
import { Unsubscribe } from 'firebase/firestore';

interface UserSliceState {
  data: IUser | null;
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  subscribers: { user: Unsubscribe | null, notifications: Unsubscribe | null };
}

const initialState: UserSliceState = {
  data: null,
  error: null,
  loading: false,
  notifications: [],
  subscribers: { user: null, notifications: null },
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
    },
    setNotifications: (state, action) => {
      const notifications = action.payload ? action.payload.map((notification: INotification) => new Notification(notification)) : []
      state.notifications = notifications;
      state.loading = false;
      state.error = null;
    },
    setSubscribers: (state, action) => {
      const type = action.payload.type
      if (type == 'notifications') {
        state.subscribers.notifications = action.payload.data
      } else if (type == 'user') {
        state.subscribers.user = action.payload.data
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState)
  }
});

export const { setUser, setNotifications, setSubscribers } = customersSlice.actions;

export const subscribeToUser = createAsyncThunk(
  'user/subscribe',
  (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { user: { data } } = getState() as RootState
      return subscribeToFirestoreDocument(`Users/${data?.id}`, dispatch, setUser)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

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

export const subscribeToNotifications = createAsyncThunk(
  'users/subscribeToNotifications',
  (_, { getState, dispatch }) => {
    const { user: { data } } = getState() as RootState
    const notificationsSubscriber = subscribeToFirestoreCollection(`Users/${data?.id}/Notifications`, dispatch, setNotifications)
    setSubscribers({ type: 'notifications', data: notificationsSubscriber })
  }
)

export const unsubscribeFromNotifications = createAsyncThunk(
  'users/unsubscribeFromNotifications',
  (_, { getState }) => {
    (getState() as RootState).user.subscribers.notifications!()
  }
)

// Selectors for accessing data from the state
export const selectUser = (state: RootState) => state.user.data;
export const selectUserNotifications = (state: RootState) => state.user.notifications;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Export the slice reducer
export default customersSlice.reducer;