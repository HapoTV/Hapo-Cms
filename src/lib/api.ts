import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base API configuration and instance creation
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000, // Increased timeout to 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        // Handle specific error cases
        switch (error.response.status) {
          case 401:
            // Redirect to login or refresh token
            window.location.href = '/auth';
            break;
          case 403:
            // Handle forbidden access
            console.error('Access forbidden');
            break;
          case 404:
            // Handle not found
            console.error('Resource not found');
            break;
          case 500:
            // Handle server error
            console.error('Server error');
            break;
        }

        throw new ApiError(
          error.response.status,
          error.response.data?.message || 'An error occurred',
          error.response.data
        );
      }
      throw error;
    }
  );

  return instance;
};

export const api = createApiInstance();