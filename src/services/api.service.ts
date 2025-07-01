/**
 * @file This is the central API client for the application.
 * It uses Axios interceptors to transparently handle JWT authentication,
 * including automatic token refreshing.
 *
 * @path src/services/api.service.ts
 */

import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {tokenService} from './token.service';
import authService from './auth.service';

const API_URL = 'https://hapo-cms.onrender.com';

// This variable acts as a "gatekeeper" to prevent multiple refresh requests
// from firing simultaneously (the "thundering herd" problem).
let refreshTokenPromise: Promise<any> | null = null;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

/**
 * --- Request Interceptor ---
 * This runs before every request. Its job is to add the
 * Authorization header if an access token exists.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    // Only add the header if the token exists.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * --- Response Interceptor ---
 * This runs after a response is received. It handles API errors,
 * with a special focus on transparently refreshing the user's session.
 */
apiClient.interceptors.response.use(
  // For successful responses (2xx), just return the response.
  (response) => response,

  // For error responses, execute this logic.
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // SCENARIO 1: The session is unrecoverable.
    // If the call to refresh the token itself fails, the session is dead.
    // We give up immediately to prevent an infinite loop.
    if (originalRequest.url === '/api/auth/refresh') {
      console.error("Refresh token is invalid or expired. Logging out.");
      tokenService.clearTokens();
      // For SPAs, programmatic navigation is better than a hard reload.
      // e.g., router.push('/login');
      window.location.href = '/auth';
      return Promise.reject(error);
    }

    // SCENARIO 2: The session might be recoverable.
    // Check for a 401/403 error on any request *other than* the refresh request.
    // The `!originalRequest._retry` flag is crucial. It ensures we only
    // try to refresh the token ONCE per failed request.
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as having been attempted once.

      // If no refresh process is already running, start one.
      if (!refreshTokenPromise) {
        refreshTokenPromise = authService.refreshToken().finally(() => {
          // When the refresh attempt is complete (success or fail),
          // unlock the gate so future token expirations can be handled.
          refreshTokenPromise = null;
        });
      }

      try {
        // Wait for the single, shared refresh token process to complete.
        await refreshTokenPromise;
        // The `refreshTokenPromise` resolves successfully, meaning we have new tokens.
        // The request interceptor will automatically add the new access token.
        // We now retry the original request that failed.
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If `await refreshTokenPromise` throws an error, it means the refresh
        // attempt failed. The user's session is definitely over.
        // The check for `/api/auth/refresh` at the top will handle this,
        // but this catch is a final safety net.
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (e.g., 500, 404), just pass them along.
    return Promise.reject(error);
  }
);

// --- API Methods ---
// Using async/await for consistency and readability.
export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url:string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },
  put: async <T>(url:string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  }
};

export default apiService;