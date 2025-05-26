export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
  },
  USERS: {
    PROFILE: '/users/me',
    BASE: '/users',
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    ANALYTICS: '/campaigns/:id/analytics',
  },
  CONTENT: {
    BASE: '/content',
    UPLOAD: '/content/upload',
  },
  SCREENS: {
    BASE: '/screens',
    STATUS: '/screens/:id/status',
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;