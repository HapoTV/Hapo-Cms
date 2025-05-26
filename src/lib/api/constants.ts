export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout'
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`
  },
  CONTENT: {
    BASE: '/contents',
    DETAIL: (id: string) => `/contents/${id}`
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    DETAIL: (id: string) => `/campaigns/${id}`
  },
  ANALYTICS: {
    BASE: '/analytics',
    EVENTS: '/analytics/events'
  },
  SETTINGS: {
    BASE: '/settings'
  },
  UPLOAD: {
    BASE: '/upload'
  }
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} as const;