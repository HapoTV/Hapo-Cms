/**
 * @file This service handles all client-side authentication logic.
 * It provides methods for user registration, login (with rate limiting),
 * session refreshing, logout, and fetching the current user's profile.
 * It is the central point of contact for any UI component that needs
 * to perform an authentication-related action.
 *
 * @path src/services/auth.service.ts
 */

import apiService from './api.service';
import { tokenService } from './token.service';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/models/user';

// --- Constants for Login Rate Limiting ---
const MAX_LOGIN_ATTEMPTS = 5; // Allow 5 attempts before locking out
const COOLDOWN_PERIOD_MS = 15 * 60 * 1000; // Lockout for 15 minutes

/**
 * A simple in-memory class to prevent brute-force login attacks.
 * In a real-world scenario, this rate-limiting would ideally also be
 * implemented on the server-side.
 */
class LoginRateLimiter {
  private attempts = 0;
  private cooldownStartTime = 0;

  /**
   * Checks if a login attempt is allowed. Throws an error if in a cooldown period.
   * @returns {boolean} Returns true if the attempt can proceed.
   * @throws {Error} If the user is rate-limited.
   */
  canAttemptLogin(): boolean {
    const now = Date.now();
    if (this.cooldownStartTime > 0) {
      if (now - this.cooldownStartTime < COOLDOWN_PERIOD_MS) {
        const timeLeft = Math.ceil((COOLDOWN_PERIOD_MS - (now - this.cooldownStartTime)) / 60000);
        throw new Error(`Too many login attempts. Please try again in ${timeLeft} minutes.`);
      }
      // Cooldown has expired, so reset it.
      this.reset();
    }
    return true;
  }

  /**
   * Records a failed login attempt and starts the cooldown if the max attempts are reached.
   */
  recordFailedAttempt() {
    this.attempts++;
    if (this.attempts >= MAX_LOGIN_ATTEMPTS) {
      this.cooldownStartTime = Date.now();
    }
  }

  /**
   * Resets the attempt counter and cooldown timer, typically after a successful login.
   */
  reset() {
    this.attempts = 0;
    this.cooldownStartTime = 0;
  }
}

const rateLimiter = new LoginRateLimiter();


// --- The Authentication Service ---

export const authService = {
  /**
   * Registers a new user with the provided data.
   * On success, it stores the returned authentication tokens.
   * @param {RegisterRequest} data - The user's registration information.
   * @returns {Promise<AuthResponse>} The authentication response from the API.
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const authResponse = await apiService.post<AuthResponse>('/api/auth/register', data);
    tokenService.setTokens(authResponse.token, authResponse.refreshToken);
    return authResponse;
  },

  /**
   * Logs in a user with the provided credentials, with rate limiting.
   * On success, it stores the tokens and resets the rate limiter.
   * @param {LoginRequest} data - The user's login credentials.
   * @returns {Promise<AuthResponse>} The authentication response from the API.
   * @throws {Error} Throws a generic error on failure or a rate-limit error.
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    rateLimiter.canAttemptLogin(); // Throws an error if rate-limited

    try {
      const authResponse = await apiService.post<AuthResponse>('/api/auth/login', data);
      tokenService.setTokens(authResponse.token, authResponse.refreshToken);
      rateLimiter.reset(); // Success, so reset the limiter
      return authResponse;
    } catch (error) {
      rateLimiter.recordFailedAttempt(); // Failure, so record the attempt
      // Throw a generic error to avoid revealing whether username/password was correct.
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  /**
   * Refreshes the session using the stored refresh token.
   * This is typically called automatically by the api.service interceptor.
   * @returns {Promise<AuthResponse>} The new authentication response with new tokens.
   * @throws {Error} If no refresh token is available.
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available for session refresh.');
    }
    const authResponse = await apiService.post<AuthResponse>('/api/auth/refresh', { refreshToken });
    tokenService.setTokens(authResponse.token, authResponse.refreshToken);
    return authResponse;
  },

  /**
   * Fetches the profile of the currently authenticated user.
   * @returns {Promise<User>} The user object.
   */
  getCurrentUser: async (): Promise<User> => {
    // Assuming the API provides an endpoint to get the current user's data
    return apiService.get<User>('/api/auth/me');
  },

  /**
   * Logs the user out. It attempts to invalidate the tokens on the server
   * and guarantees that local tokens are cleared, regardless of API call success.
   */
  logout: async (): Promise<void> => {
    const token = tokenService.getAccessToken();
    const refreshToken = tokenService.getRefreshToken();

    try {
      // Only attempt to call the API if tokens exist
      if (token && refreshToken) {
        await apiService.post('/api/auth/logout', { token, refreshToken });
      }
    } catch (error) {
        // Log the error but don't re-throw it, as we still want to log the user out locally.
        console.error('Logout API call failed, but clearing local tokens anyway:', error);
    } finally {
      // ALWAYS clear tokens locally to ensure the user is logged out on the client-side.
      tokenService.clearTokens();
    }
  },

  /**
   * Checks if the user is currently authenticated by verifying the existence
   * and validity of the access token.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  isAuthenticated: (): boolean => {
    const token = tokenService.getAccessToken();
    if (!token) {
      return false;
    }
    // Rely on the token service to check for expiration and validity
    return !tokenService.isAccessTokenExpired(token);
  }
};

export default authService;