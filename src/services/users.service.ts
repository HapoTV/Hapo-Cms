import apiService from './api.service';

export interface User {
  id?: number;
  email: string;
  username: string;
  password?: string;
  roles: ('ADMIN' | 'DISPLAY' | 'EDITOR' | 'CONTENT_MANAGER' | 'USER')[];
  active?: boolean;
  lastActive?: string;
  createdAt?: string;
}

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