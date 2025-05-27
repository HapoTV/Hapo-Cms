import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  sub: string;
  roles: string[];
}

export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Add a 30-second buffer to handle slight time differences
      return (decoded.exp * 1000) - 30000 < Date.now();
    } catch {
      return true;
    }
  },

  decodeToken: (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};