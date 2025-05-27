import { api } from './api';
import { API_ENDPOINTS } from '../../constants/api.constants';
import type { AuthResponse, LoginRequest } from '../../types/models/user';
import { tokenService } from '../storage/token.service';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    if (response.token && response.refreshToken) {
      tokenService.setTokens(response.token, response.refreshToken);
    }
    return response;
  },

  logout: async (): Promise<void> => {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();

    try {
      if (token && refreshToken) {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT, { token, refreshToken });
      }
    } finally {
      tokenService.clearTokens();
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    if (response.token && response.refreshToken) {
      tokenService.setTokens(response.token, response.refreshToken);
    }
    return response;
  },

  isAuthenticated: (): boolean => {
    const token = tokenService.getAccessToken();
    if (!token) return false;
    return !tokenService.isTokenExpired(token);
  }
};