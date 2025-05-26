import apiService from './api.service';

export interface ScreenGroup {
  id?: number;
  name: string;
  description?: string;
  screenIds: number[];
  parentGroupId?: number;
  subGroupIds?: number[];
  metadata?: any;
  defaultPlaylistId?: number;
  version?: number;
}

export const screenGroupsService = {
  createScreenGroup: async (group: ScreenGroup): Promise<ScreenGroup> => {
    return apiService.post<ScreenGroup>('/api/screen-groups', group);
  },

  getAllScreenGroups: async (): Promise<ScreenGroup[]> => {
    return apiService.get<ScreenGroup[]>('/api/screen-groups');
  },

  getScreenGroup: async (id: number): Promise<ScreenGroup> => {
    return apiService.get<ScreenGroup>(`/api/screen-groups/${id}`);
  },

  updateScreenGroup: async (id: number, group: ScreenGroup): Promise<ScreenGroup> => {
    return apiService.put<ScreenGroup>(`/api/screen-groups/${id}`, group);
  },

  deleteScreenGroup: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/screen-groups/${id}`);
  },

  getRootScreenGroups: async (): Promise<ScreenGroup[]> => {
    return apiService.get<ScreenGroup[]>('/api/screen-groups/roots');
  },

  addScreenToGroup: async (groupId: number, screenId: number): Promise<ScreenGroup> => {
    return apiService.post<ScreenGroup>(`/api/screen-groups/${groupId}/screens/${screenId}`);
  },

  removeScreenFromGroup: async (groupId: number, screenId: number): Promise<ScreenGroup> => {
    return apiService.delete<ScreenGroup>(`/api/screen-groups/${groupId}/screens/${screenId}`);
  },

  updateGroupContent: async (groupId: number, content: any): Promise<string> => {
    return apiService.post<string>(`/api/screen-groups/${groupId}/content`, content);
  }
};

export default screenGroupsService;