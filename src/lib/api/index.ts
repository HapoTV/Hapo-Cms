import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import type {
  User,
  Content,
  Campaign,
  AnalyticsEvent,
  SystemSettings,
  PageResponse,
  AuthResponse,
  LoginRequest,
  SignupRequest
} from './types';

class Api {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/signup', data);
    this.setToken(response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearToken();
    await this.client.post('/auth/logout');
  }

  // User endpoints
  async getUsers(page = 0, size = 10): Promise<PageResponse<User>> {
    const response = await this.client.get<PageResponse<User>>('/users', {
      params: { page, size }
    });
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.client.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  // Content endpoints
  async getContents(page = 0, size = 10, type?: string): Promise<PageResponse<Content>> {
    const response = await this.client.get<PageResponse<Content>>('/contents', {
      params: { page, size, type }
    });
    return response.data;
  }

  async getContent(id: string): Promise<Content> {
    const response = await this.client.get<Content>(`/contents/${id}`);
    return response.data;
  }

  async createContent(data: FormData): Promise<Content> {
    const response = await this.client.post<Content>('/contents', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async updateContent(id: string, data: Partial<Content>): Promise<Content> {
    const response = await this.client.put<Content>(`/contents/${id}`, data);
    return response.data;
  }

  async deleteContent(id: string): Promise<void> {
    await this.client.delete(`/contents/${id}`);
  }

  // Campaign endpoints
  async getCampaigns(page = 0, size = 10, status?: string): Promise<PageResponse<Campaign>> {
    const response = await this.client.get<PageResponse<Campaign>>('/campaigns', {
      params: { page, size, status }
    });
    return response.data;
  }

  async getCampaign(id: string): Promise<Campaign> {
    const response = await this.client.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  }

  async createCampaign(data: Omit<Campaign, 'id' | 'createdAt'>): Promise<Campaign> {
    const response = await this.client.post<Campaign>('/campaigns', data);
    return response.data;
  }

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const response = await this.client.put<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.client.delete(`/campaigns/${id}`);
  }

  // Analytics endpoints
  async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsEvent[]> {
    const response = await this.client.get<AnalyticsEvent[]>('/analytics', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsEvent> {
    const response = await this.client.post<AnalyticsEvent>('/analytics/events', event);
    return response.data;
  }

  // Settings endpoints
  async getSettings(): Promise<SystemSettings> {
    const response = await this.client.get<SystemSettings>('/settings');
    return response.data;
  }

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await this.client.put<SystemSettings>('/settings', data);
    return response.data;
  }

  // File upload
  async uploadFile(file: File, type: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.client.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export const api = new Api();
export type { User, Content, Campaign, AnalyticsEvent, SystemSettings, PageResponse, AuthResponse };