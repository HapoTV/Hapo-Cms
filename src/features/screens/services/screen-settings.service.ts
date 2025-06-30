import {apiService} from '../../../services/api.service';
import type {ScreenSettings} from '../types/settings';

export const screenSettingsService = {
  getScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    return apiService.get(`/screens/${screenId}/settings`);
  },

  updateScreenSettings: async (screenId: string, settings: ScreenSettings): Promise<ScreenSettings> => {
    return apiService.put(`/screens/${screenId}/settings`, settings);
  },

  resetScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    return apiService.post(`/screens/${screenId}/settings/reset`);
  },

  applyScreenSettings: async (screenId: string, templateId: string): Promise<ScreenSettings> => {
    return apiService.post(`/screens/${screenId}/settings/apply-template`, {templateId});
  },
};