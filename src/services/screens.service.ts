// src/services/screens.service.ts

import apiService from './api.service';
import type {Screen, ScreenConnectionStatus, ScreenStatus} from '../types/models/screen.types';
import type {Content} from '../types/models/ContentItem.ts'; // Assuming you have a type for this
import type {ScreenCreationPayload} from '../types/requests/screen.requests';

// --- API & PAYLOAD TYPES ---

/**
 * A generic type for the standard API response wrapper used throughout the backend.
 * All service functions will handle this wrapper and extract the `data` property.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

/**
 * The data payload for updating an existing screen.
 * Uses Partial<T> to indicate that not all fields are required for an update.
 * We omit fields that should not be changed via this endpoint (like id or live status).
 */
export type ScreenUpdatePayload = Partial<Omit<Screen, 'id' | 'status' | 'currentPlaylist' | 'playlistQueue'>>;

/**
 * Type for the individual items in the `/count/all-statuses` response array.
 */
export interface ScreenStatusCount {
  status: ScreenStatus;
  count: number;
}

/**
 * The final, transformed data shape the app will use for status counts.
 * A Record<K, T> is a perfect, type-safe way to represent this dictionary-like object.
 */
export type AllScreenStatusCounts = Record<ScreenStatus, number>;


// --- SCREENS SERVICE (UPDATED AND PERFECTED) ---
export const screensService = {

  // === Core CRUD Operations ===

  /**
   * Fetches all registered screens from the backend.
   * @returns A promise that resolves to an array of Screen objects.
   */
  getAllScreens: async (): Promise<Screen[]> => {
    const response = await apiService.get<ApiResponse<Screen[]>>('/api/screens/all');
    return response.data;
  },

  /**
   * Fetches a single screen by its unique ID.
   * @param id The numeric ID of the screen.
   * @returns A promise that resolves to a single Screen object.
   */
  getScreenById: async (id: number): Promise<Screen> => {
    const response = await apiService.get<ApiResponse<Screen>>(`/api/screens/${id}`);
    return response.data;
  },

  /**
   * Creates a new screen using a screen code from a physical device.
   * @param payload The data required to create a screen, including the screen code.
   * @returns A promise that resolves to the newly created Screen object.
   */
  createScreenFromCode: async (payload: ScreenCreationPayload): Promise<Screen> => {
    const response = await apiService.post<ApiResponse<Screen>>('/api/screens', payload);
    return response.data;
  },

  /**
   * Updates an existing screen's properties.
   * @param id The ID of the screen to update.
   * @param payload An object containing the fields to update.
   * @returns A promise that resolves to the updated Screen object.
   */
  updateScreen: async (id: number, payload: ScreenUpdatePayload): Promise<Screen> => {
    // 1. Get the current state of the screen
    const currentScreen = await screensService.getScreenById(id);

    // 2. Merge the updates into the full screen object
    const updatedScreenData = {...currentScreen, ...payload};

    // 3. Send the complete object to the backend
    const response = await apiService.put<ApiResponse<Screen>>(`/api/screens/${id}`, updatedScreenData);
    return response.data;
  },

  /**
   * CORRECTED: Deletes a screen permanently from the database.
   * NOTE: This assumes you will add a corresponding endpoint to your backend.
   * e.g., @DeleteMapping("/permanent/{screenId}")
   */
  deleteScreenPermanent: async (id: number): Promise<void> => {
    // This endpoint must perform a full database delete on the backend.
    await apiService.delete<ApiResponse<string | null>>(`/api/screens/permanent/${id}`);
  },


  // === Status & Filtering Operations ===

  /**
   * Retrieves a list of screens matching a specific status.
   * @param status The status to filter by (e.g., 'ONLINE', 'OFFLINE').
   * @returns A promise that resolves to an array of matching Screen objects.
   */
  getScreensByStatus: async (status: ScreenStatus): Promise<Screen[]> => {
    const response = await apiService.get<ApiResponse<Screen[]>>(`/api/screens/filter/status/${status}`);
    return response.data;
  },

  /**
   * Gets the count of all screens, grouped by their status.
   * This function fetches an array from the API and transforms it into a
   * more convenient flat object for UI components.
   * @returns A promise that resolves to an object where keys are statuses and values are the counts.
   */
  countAllScreensByStatus: async (): Promise<AllScreenStatusCounts> => {
    const response = await apiService.get<ApiResponse<ScreenStatusCount[]>>('/api/screens/count/all-statuses');

    // Initialize with all possible statuses to ensure the UI doesn't break
    // if the API omits a status with a count of 0.
    const initialCounts: AllScreenStatusCounts = {
      ONLINE: 0,
      OFFLINE: 0,
      MAINTENANCE: 0,
      PENDING: 0,
      UNREGISTERED: 0
    };

    // Use the fetched data to populate the initial counts object.
    return response.data.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, initialCounts);
  },

  /**
   * NEW: Manually updates the status of a specific screen.
   * @param screenId The ID of the screen.
   * @param status The new status to set.
   */
  updateScreenStatus: async (screenId: number, status: ScreenStatus): Promise<void> => {
    // The backend returns a simple success message, so we just care about the wrapper
    await apiService.put<ApiResponse<string>>(`/api/screens/${screenId}/status`, status);
  },


  // === Live Connection & Other Operations ===

  /**
   * Fetches a list of all currently active WebSocket connections.
   * @returns A promise that resolves to an array of connection status objects.
   */
  getActiveConnections: async (): Promise<ScreenConnectionStatus[]> => {
    const response = await apiService.get<ApiResponse<ScreenConnectionStatus[]>>('/api/screens/connections');
    return response.data;
  },

  /**
   * NEW: Retrieves the activity status for a single screen.
   * @param screenId The ID of the screen to get activity for.
   * @returns A promise that resolves to the screen's connection status object.
   */
  getScreenActivity: async (screenId: number): Promise<ScreenConnectionStatus> => {
    const response = await apiService.get<ApiResponse<ScreenConnectionStatus>>(`/api/screens/${screenId}/activity`);
    return response.data;
  },

  /**
   * NEW: Finds screens within a given radius of a geographical point.
   */
  findNearbyScreens: async (lat: number, lng: number, radiusInMeters: number = 1000): Promise<Screen[]> => {
    const response = await apiService.get<ApiResponse<Screen[]>>(`/api/screens/nearby?lat=${lat}&lng=${lng}&radiusInMeters=${radiusInMeters}`);
    return response.data;
  },

  /**
   * NEW: Sends new content data to a specific screen.
   * @param screenId The ID of the screen to update.
   * @param content The content payload.
   */
  updateScreenContent: async (screenId: number, content: Content): Promise<void> => {
    await apiService.post<ApiResponse<string>>(`/api/screens/${screenId}/content`, content);
  },
};

export default screensService;