import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenService } from './token.service';
import { ApiError } from '../types/errortypes/api.types';
// We remove the authService import here to prevent circular dependencies.

// This gatekeeper promise must live OUTSIDE the factory function to be a true singleton.
let refreshTokenPromise: Promise<any> | null = null;

const createApiInstance = (): AxiosInstance => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    // Request interceptor: No changes needed here.
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = tokenService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => {
            console.error('Request Error:', error);
            return Promise.reject(error);
        }
    );

    // --- UPDATED RESPONSE INTERCEPTOR ---
    instance.interceptors.response.use(
        // On success, we now return the data directly as per your original design.
        (response: AxiosResponse) => response.data,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // Case 1: The error is a 401 Unauthorized, we have a request config, and we haven't already retried.
            if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                originalRequest._retry = true;

                // If a refresh is NOT already in progress, start one.
                if (!refreshTokenPromise) {
                    const oldRefreshToken = tokenService.getRefreshToken();
                    if (oldRefreshToken) {
                        // Create the refresh promise. This is self-contained and doesn't need authService.
                        refreshTokenPromise = axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken: oldRefreshToken })
                            .then(res => {
                                const { token, refreshToken } = res.data;
                                tokenService.setTokens(token, refreshToken);
                                return token;
                            }).finally(() => {
                                // Unlock the gate when done.
                                refreshTokenPromise = null;
                            });
                    } else {
                        // If no refresh token, fail immediately.
                        return Promise.reject(new ApiError(401, 'No refresh token available.'));
                    }
                }

                try {
                    // Wait for the single refresh promise to complete
                    const newToken = await refreshTokenPromise;
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    // The original response interceptor returned `response.data`, so we call the instance
                    // which will go through the interceptor again and return data on success.
                    return instance(originalRequest);
                } catch (refreshError) {
                    tokenService.clearTokens();
                    window.location.href = '/auth'; // User session is unrecoverable, force re-login.
                    // We throw a clear error for debugging purposes.
                    throw new ApiError(401, 'Session expired. Please log in again.', refreshError);
                }
            }

            // Case 2: For all other errors, normalize them into our custom ApiError.
            if (error.response) {
                const status = error.response.status;
                const message = (error.response.data as any)?.message || error.message;
                throw new ApiError(status, message, error.response.data);
            }

            // Case 3: For network errors or other issues where there's no response.
            throw new ApiError(503, 'Network error or server is not responding.', error);
        }
    );

    return instance;
};

// Export a single, ready-to-use instance of the API service.
export const api = createApiInstance();