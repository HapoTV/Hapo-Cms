// src/features/screens/services/screen-settings.service.ts

import {apiService} from '../../../services/api.service';
import type {ScreenSettings} from '../types/settings';

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
 * The data payload for updating screen settings.
 * Uses Partial<T> to indicate that not all fields are required for an update.
 */
export type ScreenSettingsUpdatePayload = Partial<ScreenSettings>;

/**
 * The data payload for applying a template to screen settings.
 */
export type ApplyTemplatePayload = {
  templateId: string;
};


// --- SCREEN SETTINGS SERVICE ---
export const screenSettingsService = {
  // === Settings Operations ===

  /**
   * Fetches the settings for a specific screen.
   * @param screenId The ID of the screen.
   * @returns A promise that resolves to the screen's settings object.
   */
  getScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    const response = await apiService.get<ApiResponse<ScreenSettings>>(`/api/screens/${screenId}/settings`);
    return response.data;
  },

  /**
   * Updates the settings for a specific screen.
   * @param screenId The ID of the screen.
   * @param payload An object containing the settings fields to update.
   * @returns A promise that resolves to the updated screen's settings object.
   */
  updateScreenSettings: async (screenId: string, payload: ScreenSettingsUpdatePayload): Promise<ScreenSettings> => {
    const response = await apiService.put<ApiResponse<ScreenSettings>>(`/api/screens/${screenId}/settings`, payload);
    return response.data;
  },

  /**
   * Resets a screen's settings to their default values.
   * @param screenId The ID of the screen to reset.
   * @returns A promise that resolves to the new, default settings object.
   */
  resetScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    const response = await apiService.post<ApiResponse<ScreenSettings>>(`/api/screens/${screenId}/settings/reset`);
    return response.data;
  },

  /**
   * Applies a predefined settings template to a screen.
   * @param screenId The ID of the screen to apply the template to.
   * @param payload An object containing the ID of the template to apply.
   * @returns A promise that resolves to the screen's new settings after applying the template.
   */
  applyScreenSettings: async (screenId: string, payload: ApplyTemplatePayload): Promise<ScreenSettings> => {
    const response = await apiService.post<ApiResponse<ScreenSettings>>(`/api/screens/${screenId}/settings/apply-template`, payload);
    return response.data;
  },
};

export default screenSettingsService;