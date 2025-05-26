import apiService from './api.service';
import tokenService from './token.service';

export interface UserDTO {
  email: string;
  username: string;
  roles: string[];
  lastActive: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserDTO;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DISPLAY' | 'EDITOR' | 'CONTENT_MANAGER' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  token: string;
  refreshToken: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/api/auth/register', data);
    tokenService.setTokens(response.token, response.refreshToken);
    return response;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/api/auth/login', data);
    tokenService.setTokens(response.token, response.refreshToken);
    return response;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/api/auth/refresh', { refreshToken });
    tokenService.setTokens(response.token, response.refreshToken);
    return response;
  },

  logout: async (): Promise<void> => {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();
    
    try {
      await apiService.post('/api/auth/logout', { token, refreshToken });
    } finally {
      tokenService.clearTokens();
    }
  },

  isAuthenticated: (): boolean => {
    const token = tokenService.getAccessToken();
    if (!token) return false;
    return !tokenService.isTokenExpired(token);
  }
};

export default authService;