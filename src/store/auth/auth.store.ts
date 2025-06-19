// This file is
// part of the Zustand store setup for user authentication in a React application
// src/store/auth/auth.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { isAxiosError } from 'axios'; // Import the type guard from Axios
import { User } from '../../types/models/user';
import { authService } from '../../services/auth.service';
// import { usersService } from '../../services/user/users.service.ts'; // See recommendation below

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>; // --> ADDED: New action interface
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools<AuthState>(
    (set) => ({
      // --- INITIAL STATE (This is correct, no changes needed) ---
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // --- ACTIONS ---
      checkAuthStatus: async () => {
        try {
          // RECOMMENDATION: Standardize on a single service for user data.
          // Since authService already has a getCurrentUser, using it here is cleaner.
          const user = await authService.getCurrentUser();
          set({ user: user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          // This logic is correct. It handles the "no valid session" case.
          set({ user: null, isAuthenticated: false, isLoading: false });
          console.error('Failed to get user data from server.', error);
        }
      },

      // --- UPDATED LOGIN ACTION ---
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          // Provide more specific error messages to the user.
          let errorMessage = 'An unexpected error occurred.';

          if (isAxiosError(error)) {
            if (error.response?.status === 401) {
              errorMessage = 'Invalid email or password.';
            } else if (error.response?.status === 429) {
              errorMessage = 'Too many login attempts. Please try again in a few minutes.';
            } else {
              // Handle other potential server errors
              errorMessage = error.response?.data?.message || 'A server error occurred.';
            }
          } else if (error instanceof Error) {
            // This will catch the client-side rate limiter error from your authService
            // (e.g., "Too many login attempts. Please try again in 15 minutes.")
            errorMessage = error.message;
          }

          set({
            error: errorMessage,
            isLoading: false
          });
          throw error; // Re-throw so form handling libraries (like React Hook Form) know there was an error.
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error) {
          // This is fine, but we can make it slightly more robust.
          const errorMessage = isAxiosError(error)
            ? 'Failed to log out on the server.'
            : 'An error occurred during logout.';
          console.error(errorMessage, error); // Log the actual error for debugging
          set({
            error: errorMessage,
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);