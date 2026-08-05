import axios from 'axios';
import { store } from '../store/store';
import { setCredentials, logOut } from '../store/authSlice';

// 1. Create a base Axios instance. This saves us from typing the base URL every time.
const api = axios.create({
    baseURL: 'http://localhost:8080', // Removed /api prefix to match backend
    withCredentials: true // CRITICAL: This tells Axios to automatically send the HttpOnly cookies!
});

// 2. Request Interceptor: Attach the Access Token before sending the request
api.interceptors.request.use(
    (config) => {
        // Grab the latest state from Redux
        const state = store.getState();
        const token = state.auth.accessToken;

        // If we have a token in memory, attach it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Handle 401 Unauthorized errors gracefully (Silent Refresh)
api.interceptors.response.use(
    (response) => {
        // If the request succeeds, just return the response normally
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't already retried this request...
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark it so we don't get stuck in an infinite loop

            try {
                // Attempt to silently get a new access token using the HttpOnly cookie
                // Note: The browser will automatically attach the HttpOnly cookie here because of `withCredentials: true`
                const response = await axios.post(
                    'http://localhost:8080/api/auth/refresh', // Your backend refresh endpoint
                    {}, 
                    { withCredentials: true } 
                );

                // Assuming your backend returns the new token in the JSON body: { accessToken: "..." }
                const newAccessToken = response.data.accessToken;

                // Save the new token back into Redux memory
                store.dispatch(setCredentials({ accessToken: newAccessToken, user: response.data.user }));

                // Update the original failed request with the fresh token and try it again!
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // If the refresh token request fails (e.g., the 30-day cookie expired too),
                // we log the user out completely. They must log in again manually.
                store.dispatch(logOut());
                return Promise.reject(refreshError);
            }
        }

        // If it was any other error (like 500, 404), just reject it normally
        return Promise.reject(error);
    }
);

export default api;
