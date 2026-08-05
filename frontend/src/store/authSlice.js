import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  isAuthenticated: false,
  user: null, // Optional: store user info here
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
    },
    // Call this when logout happens or if refresh token fails completely
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

// Selectors to easily grab this data in our React components
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
