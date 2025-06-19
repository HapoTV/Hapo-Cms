//service to manage user-related API calls
// src/services/user/users.service.ts
import apiService from '../api.service.ts';
import type { User } from '../../types/models/user.ts';

export const usersService = {
  getCurrentUser: async (): Promise<User> => {
    return apiService.get<User>('/api/user/me');
  },

  getAllUsers: async (): Promise<User[]> => {
    return apiService.get<User[]>('/admin/users');
  },

  getUserById: async (id: number): Promise<User> => {
    return apiService.get<User>(`/admin/users/${id}`);
  },

  updateUser: async (id: number, userData: User): Promise<User> => {
    return apiService.put<User>(`/admin/users/${id}`, userData);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/admin/users/${id}`);
  },

  toggleUserStatus: async (id: number): Promise<User> => {
    return apiService.patch<User>(`/admin/users/${id}/toggle-status`);
  }
};

export default usersService;