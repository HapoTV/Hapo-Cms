// services/screens.service.ts

import apiService from './api.service';
import {
  Screen,
  ScreenConnectionStatus,
  ScreenStatus // Ensure UNREGISTERED is in this type
} from '../types/models/screen.types'; // Assuming types are in screen.types.ts

// --- NEW/UPDATED TYPES ---

// Generic type for your standard API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

// Type for the individual items in the /count/all-statuses response array
export interface ScreenStatusCount {
  status: ScreenStatus;
  count: number;
}

// This type represents the FINAL, TRANSFORMED data that the app will use.
export type AllScreenStatusCounts = Record<ScreenStatus, number>;


export const screensService = {
  // --- Existing Functions ---
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

  getScreenByName: async (name: string): Promise<Screen> => {
    return apiService.get<Screen>(`/api/screens/${name}`);
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

  getScreenStatus: async (screenId: number): Promise<ScreenStatus> => {
    // Corrected the return type to match the defined ScreenStatus type
    return apiService.get<ScreenStatus>(`/api/screens/status/${screenId}`);
  },

  // --- NEWLY GENERATED FUNCTIONS ---

  /**
   * Retrieves a list of screens by their status.
   * @param status The status of the screens to retrieve (e.g., 'ONLINE', 'OFFLINE').
   * @returns A promise that resolves to an array of screens with the specified status.
   */
  getScreensByStatus: async (status: ScreenStatus | string): Promise<Screen[]> => {
    return apiService.get<Screen[]>(`/api/screens/filter/status/${status}`);
  },

  /**
   * Gets the count of screens with a specific status.
   * @param status The status to count.
   * @returns A promise that resolves to an object containing the status and its count.
   */
  countScreensByStatus: async (status: ScreenStatus | string): Promise<ScreenStatusCount> => {
    return apiService.get<ScreenStatusCount>(`/api/screens/count/status/${status}`);
  },

  /**
   * Gets the count of all screens, grouped by their status.
   * This function fetches an array from the API and transforms it into a
   * flat object for easier use in components.
   * @returns A promise that resolves to an object where keys are statuses and values are the counts.
   */
  countAllScreensByStatus: async (): Promise<AllScreenStatusCounts> => {
    // 1. Fetch the data, expecting the standard API wrapper response.
    // The actual data we care about is an array of ScreenStatusCount objects.
    const response = await apiService.get<ApiResponse<ScreenStatusCount[]>>('/api/screens/count/all-statuses');

    // 2. Initialize a result object with all possible statuses set to 0.
    // This ensures that even statuses with no screens are represented.
    const initialCounts: AllScreenStatusCounts = {
      ONLINE: 0,
      OFFLINE: 0,
      MAINTENANCE: 0,
      PENDING: 0,
      UNREGISTERED: 0
    };

    // 3. Use the 'data' array from the response to populate our initialCounts object.
    // The .reduce() method is perfect for transforming an array into an object.
    const finalCounts = response.data.reduce((accumulator, currentItem) => {
      // For each item in the array (e.g., { status: 'ONLINE', count: 55 }),
      // update the corresponding key in our accumulator object.
      accumulator[currentItem.status] = currentItem.count;
      return accumulator;
    }, initialCounts);

    return finalCounts;
  }
};

export default screensService;