import { api } from '../../../services/api/api';
import type { ScreenSettings } from '../types/settings';

export const screenSettingsService = {
  getScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    return api.get(`/screens/${screenId}/settings`);
  },

  updateScreenSettings: async (screenId: string, settings: ScreenSettings): Promise<ScreenSettings> => {
    return api.put(`/screens/${screenId}/settings`, settings);
  },

  resetScreenSettings: async (screenId: string): Promise<ScreenSettings> => {
    return api.post(`/screens/${screenId}/settings/reset`);
  },

  applyScreenSettings: async (screenId: string, templateId: string): Promise<ScreenSettings> => {
    return api.post(`/screens/${screenId}/settings/apply-template`, { templateId });
  },
};