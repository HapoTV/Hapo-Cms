export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  lastActive: string;
  createdAt: string;
}

export interface Content {
  id: string;
  name: string;
  type: 'image' | 'video' | 'template' | 'document';
  url: string;
  tags: string[];
  metadata?: Record<string, any>;
  userId: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  locations: string[];
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  contentIds: string[];
  userId: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: 'view' | 'engagement';
  campaignId?: string;
  contentId?: string;
  location?: string;
  duration?: number;
  timestamp: string;
  userId?: string;
}

export interface SystemSettings {
  id: number;
  retentionPeriod: number;
  defaultTags: string[];
  analyticsEnabled: boolean;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}