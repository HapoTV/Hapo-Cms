import { jwtDecode } from 'jwt-decode';
import { DecodedAccessToken, DecodedRefreshToken } from '../types/models/token';

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

  isAccessTokenExpired: (token?: string | null): boolean => {
    try {
      const tokenToCheck = token || tokenService.getAccessToken();
      if (!tokenToCheck) return true;

      const decoded = jwtDecode<DecodedAccessToken>(tokenToCheck);

      // Verify token type
      if (decoded.type !== 'access') return true;

      // Verify audience
      if (decoded.aud !== 'hapocloud-client') return true;

      // Verify issuer
      if (decoded.iss !== 'hapocloud-api') return true;

      // Add 30-second buffer to handle clock skew
      return (decoded.exp * 1000) - 30000 < Date.now();
    } catch {
      return true;
    }
  },

  isRefreshTokenExpired: (token?: string | null): boolean => {
    try {
      const tokenToCheck = token || tokenService.getRefreshToken();
      if (!tokenToCheck) return true;

      const decoded = jwtDecode<DecodedRefreshToken>(tokenToCheck);

      // Verify token type
      if (decoded.type !== 'refresh') return true;

      // Verify audience
      if (decoded.aud !== 'hapocloud-refresh') return true;

      // Verify issuer
      if (decoded.iss !== 'hapocloud-api') return true;

      // Add 30-second buffer to handle clock skew
      return (decoded.exp * 1000) - 30000 < Date.now();
    } catch {
      return true;
    }
  },

  getTokenExpiryTime: (token: string): Date | null => {
    try {
      const decoded = jwtDecode<DecodedAccessToken | DecodedRefreshToken>(token);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  },

  getRemainingTime: (token: string): number => {
    try {
      const decoded = jwtDecode<DecodedAccessToken | DecodedRefreshToken>(token);
      return Math.max(0, (decoded.exp * 1000) - Date.now());
    } catch {
      return 0;
    }
  },

  validateToken: (token: string): {
    isValid: boolean;
    error?: string;
  } => {
    try {
      const decoded = jwtDecode<DecodedAccessToken | DecodedRefreshToken>(token);

      // Check if token is expired
      if ((decoded.exp * 1000) - 30000 < Date.now()) {
        return { isValid: false, error: 'Token has expired' };
      }

      // Verify issuer
      if (decoded.iss !== 'hapocloud-api') {
        return { isValid: false, error: 'Invalid token issuer' };
      }

      // Verify audience based on token type
      if (decoded.type === 'access' && decoded.aud !== 'hapocloud-client') {
        return { isValid: false, error: 'Invalid access token audience' };
      }

      if (decoded.type === 'refresh' && decoded.aud !== 'hapocloud-refresh') {
        return { isValid: false, error: 'Invalid refresh token audience' };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid token format'
      };
    }
  }
};