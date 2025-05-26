import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../../types/models/user';
import { authService } from '../../services/api/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
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
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
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
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed',
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