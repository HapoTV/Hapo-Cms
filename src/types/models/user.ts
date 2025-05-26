export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  lastActive: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DISPLAY' | 'EDITOR' | 'CONTENT_MANAGER' | 'USER';
}