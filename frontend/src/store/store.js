import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// This creates the central "brain" or memory bank for our React app.
// We are registering our 'auth' slice so it can manage authentication state.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // DevTools are enabled by default, which is great for debugging!
});
