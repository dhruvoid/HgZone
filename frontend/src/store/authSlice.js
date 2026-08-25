import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
const storedToken = localStorage.getItem('accessToken');

const initialState = {
  accessToken: storedToken,
  isAuthenticated: !!storedToken,
  user: storedUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Call this when login is successful or when a silent refresh succeeds
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken || '');
      localStorage.setItem('user', JSON.stringify(action.payload.user || null));
    },
    // Call this when logout happens or if refresh token fails completely
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

// Selectors to easily grab this data in our React components
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
