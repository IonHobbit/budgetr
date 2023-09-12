import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { subscribeToFirestoreCollection } from '@/utils/firebase.util';
import { resetAll } from '../rootAction';
import { IUser, User, UserRole } from '@/models/user';

interface UsersSliceState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersSliceState = {
  data: [],
  loading: false,
  error: null
};

export const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload ? action.payload.map((user: IUser) => new User(user)) : [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToUsers.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(subscribeToUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching users data';
      })
      .addCase(resetAll, () => initialState);
  }
});

export const subscribeToUsers = createAsyncThunk(
  'Users/subscribe',
  (_, thunkAPI) => {
    try {
      const { user: { data } } = thunkAPI.getState() as RootState;
      if (data?.role == UserRole.CUSTODIAN) {
        return subscribeToFirestoreCollection('Users', thunkAPI.dispatch, setUsers)
      }
    } catch (error) {
      thunkAPI.rejectWithValue(error)
    }
  }
)

export const { setUsers } = UsersSlice.actions;

// Selectors for accessing data from the state
export const selectUsersState = (state: RootState) => state.users;
export const selectUsers = (state: RootState) => state.users.data;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;

// Export the slice reducer
export default UsersSlice.reducer;