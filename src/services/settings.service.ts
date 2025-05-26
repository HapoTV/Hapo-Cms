import apiService from './api.service';

export interface Resolution {
  id: number;
  name: string;
  width: number;
  height: number;
  default: boolean;
}

export interface SystemSettings {
  retentionPeriod: number;
  defaultTags: string[];
  analyticsEnabled: boolean;
}

export const settingsService = {
  getResolutions: async (): Promise<Resolution[]> => {
    return apiService.get<Resolution[]>('/settings/resolutions');
  },
  
  createResolution: async (resolution: Omit<Resolution, 'id'>): Promise<Resolution> => {
    return apiService.post<Resolution>('/settings/resolutions', resolution);
  },
  
  updateResolution: async (id: number, resolution: Partial<Resolution>): Promise<Resolution> => {
    return apiService.put<Resolution>(`/settings/resolutions/${id}`, resolution);
  },
  
  deleteResolution: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/settings/resolutions/${id}`);
  },
  
  setDefaultResolution: async (id: number): Promise<Resolution> => {
    return apiService.patch<Resolution>(`/settings/resolutions/${id}/default`, { default: true });
  },
  
  getSystemSettings: async (): Promise<SystemSettings> => {
    return apiService.get<SystemSettings>('/settings/system');
  },
  
  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiService.put<SystemSettings>('/settings/system', settings);
  },
  
  // Alternative implementation using Supabase directly
  getSystemSettingsFromSupabase: async (): Promise<SystemSettings> => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();
      
    if (error) throw error;
    
    return {
      retentionPeriod: data.retention_period,
      defaultTags: data.default_tags,
      analyticsEnabled: data.analytics_enabled
    };
  },
  
  updateSystemSettingsWithSupabase: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const updateData: Record<string, any> = {};
    
    if (settings.retentionPeriod !== undefined) {
      updateData.retention_period = settings.retentionPeriod;
    }
    
    if (settings.defaultTags !== undefined) {
      updateData.default_tags = settings.defaultTags;
    }
    
    if (settings.analyticsEnabled !== undefined) {
      updateData.analytics_enabled = settings.analyticsEnabled;
    }
    
    const { data, error } = await supabase
      .from('system_settings')
      .update(updateData)
      .eq('id', 1) // Assuming there's only one system settings record
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      retentionPeriod: data.retention_period,
      defaultTags: data.default_tags,
      analyticsEnabled: data.analytics_enabled
    };
  }
};

export default settingsService;