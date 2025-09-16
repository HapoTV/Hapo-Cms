// src/services/screens.service.ts

import apiService from './api.service';
import type {
    Screen,
    ScreenConnectionStatus,
    ScreenCreationPayload,
    ScreenLocationDTO,
    ScreenSettingsDTO,
    ScreenStatus
} from '../types/models/screen.types';
import {ContentItem} from '../types/models/ContentItem.ts';

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

// --- SCREENS SERVICE (FIXED FOR UUID) ---
export const screensService = {

  // === Core CRUD Operations ===

  /**f
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
  getScreenById: async (id: string): Promise<Screen> => {
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
  updateScreen: async (id: string, payload: ScreenUpdatePayload): Promise<Screen> => {
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
  deleteScreenPermanent: async (id: string): Promise<void> => {
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
      // Fetch with a flexible type to allow runtime shape guards.
      const response = await apiService.get<any>('/api/screens/count/all-statuses');

    // Initialize with all possible statuses to ensure the UI doesn't break
    // if the API omits a status with a count of 0.
    const initialCounts: AllScreenStatusCounts = {
      ONLINE: 0,
      OFFLINE: 0,
      MAINTENANCE: 0,
      PENDING: 0,
      UNREGISTERED: 0
    };

      // Determine the actual payload (support both wrapped and unwrapped arrays)
      const raw = response && Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);

      // Optional debug logging behind env flag
      try {
          const debug = (import.meta as any)?.env?.VITE_DEBUG_API === 'true';
          if (debug) {
              // eslint-disable-next-line no-console
              console.log('[DEBUG_API] /api/screens/count/all-statuses raw:', raw);
          }
      } catch (_) {
          // ignore env access issues
      }

      // Use the fetched data to populate the initial counts object with guards
      return (raw as any[]).reduce((acc, item) => {
          const status = String((item as any)?.status).toUpperCase();
          const count = Number((item as any)?.count ?? 0);
          if (status in acc && Number.isFinite(count)) {
              acc[status as ScreenStatus] = count;
          }
      return acc;
    }, initialCounts);
  },

  /**
   * NEW: Manually updates the status of a specific screen.
   * @param screenId The ID of the screen.
   * @param status The new status to set.
   */
  updateScreenStatus: async (screenId: string, status: ScreenStatus): Promise<void> => {
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
  getScreenActivity: async (screenId: string): Promise<ScreenConnectionStatus> => {
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
     * Fetches all screen locations (lightweight DTO for mapping/display purposes).
     * Mirrors the backend endpoint: GET /api/screens/locations
     */
    getAllScreenLocations: async (): Promise<ScreenLocationDTO[]> => {
        const response = await apiService.get<ApiResponse<ScreenLocationDTO[]>>('/api/screens/locations');
        return response.data;
    },

  /**
   * NEW: Sends new content data to a specific screen.
   * @param screenId The ID of the screen to update.
   * @param contentItem The content payload.
   */
  updateScreenContent: async (screenId: string, contentItem: ContentItem): Promise<void> => {
    await apiService.post<ApiResponse<string>>(`/api/screens/${screenId}/content`, contentItem);
  },

    // === Screen Settings Methods ===
    getScreenSettings: async (screenId: string): Promise<ScreenSettingsDTO> => {
        const response = await apiService.get<ApiResponse<ScreenSettingsDTO>>(`/api/screens/${screenId}/settings`);
        return response.data;
    },

    updateScreenSettings: async (screenId: string, settings: ScreenSettingsDTO): Promise<ScreenSettingsDTO> => {
        const response = await apiService.put<ApiResponse<ScreenSettingsDTO>>(`/api/screens/${screenId}/settings`, settings);
        return response.data;
    },

    resetScreenSettings: async (screenId: string): Promise<ScreenSettingsDTO> => {
        const response = await apiService.post<ApiResponse<ScreenSettingsDTO>>(`/api/screens/${screenId}/settings/reset`);
        return response.data;
    },

    applyScreenSettingsTemplate: async (screenId: string, templateId: string): Promise<ScreenSettingsDTO> => {
        const response = await apiService.post<ApiResponse<ScreenSettingsDTO>>(
            `/api/screens/${screenId}/settings/apply-template`,
            {templateId}
        );
        return response.data;
    },

    // === Additional missing methods (if needed for device communication) ===
    connectScreenByCode: async (screenCode: string): Promise<Screen> => {
        const response = await apiService.post<ApiResponse<Screen>>(`/api/screens/connect/${screenCode}`);
        return response.data;
    },

    registerScreen: async (screen: Screen): Promise<string> => {
        const response = await apiService.post<ApiResponse<string>>('/api/screens/register', screen);
        return response.data;
    },

    removeScreen: async (screenId: string): Promise<string> => {
        const response = await apiService.delete<ApiResponse<string>>(`/api/screens/${screenId}`);
        return response.data;
    }
};

export default screensService;