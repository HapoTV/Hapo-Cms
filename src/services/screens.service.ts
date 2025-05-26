import apiService from './api.service';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ScreenSettings {
  loop: boolean;
  cacheMedia: boolean;
  fallbackToCache: boolean;
  metadata: any;
}

export interface Screen {
  id?: number;
  name: string;
  location: Location;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  type: 'WINDOWS' | 'MAC' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB' | 'OTHER';
  metadata: any;
  screenSettingsDTO: ScreenSettings;
}

export interface ScreenConnectionStatus {
  screenId: number;
  sessionId: string;
  lastHeartbeat: string;
  connectionIp: string;
  clientInfo: string;
  connected: boolean;
}

export const screensService = {
  registerScreen: async (screen: Screen): Promise<Screen> => {
    return apiService.post<Screen>('/api/screens/register', screen);
  },

  createScreen: async (screen: Screen): Promise<Screen> => {
    return apiService.post<Screen>('/api/screens', screen);
  },

  getScreenById: async (id: number): Promise<Screen> => {
    return apiService.get<Screen>(`/api/screens/${id}`);
  },

  updateScreen: async (id: number, screen: Screen): Promise<Screen> => {
    return apiService.put<Screen>(`/api/screens/${id}`, screen);
  },

  deleteScreen: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/screens/${id}`);
  },

  getAllScreens: async (): Promise<Screen[]> => {
    return apiService.get<Screen[]>('/api/screens/all');
  },

  updateScreenContent: async (screenId: number, content: any): Promise<void> => {
    return apiService.post<void>(`/api/screens/${screenId}/content`, content);
  },

  getNearbyScreens: async (lat: number, lng: number, radiusInMeters: number = 1000): Promise<Screen[]> => {
    return apiService.get<Screen[]>(`/api/screens/nearby?lat=${lat}&lng=${lng}&radiusInMeters=${radiusInMeters}`);
  },

  getActiveConnections: async (): Promise<ScreenConnectionStatus[]> => {
    return apiService.get<ScreenConnectionStatus[]>('/api/screens/connections');
  },

  getScreenStatus: async (screenId: number): Promise<'ONLINE' | 'OFFLINE' | 'MAINTENANCE'> => {
    return apiService.get<'ONLINE' | 'OFFLINE' | 'MAINTENANCE'>(`/api/screens/status/${screenId}`);
  }
};

export default screensService;