export interface User {
    id: string;
    email: string;
    username: string;
    password?: string;
    roles: string[];
    active: boolean;
    lastActive: string;
    createdAt: string;
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
    role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CONTENT_MANAGER' | 'USER';
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface LogoutRequest {
    token: string;
    refreshToken: string;
}