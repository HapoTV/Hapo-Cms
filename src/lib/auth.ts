import { api } from './api';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    email: string;
    username: string;
    roles: string[];
    lastActive: string;
  }
}

interface DecodedToken {
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

export const auth = {
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return {
        email: decoded.sub,
        roles: decoded.roles
      };
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }
};