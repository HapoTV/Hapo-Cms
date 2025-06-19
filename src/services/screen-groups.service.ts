import apiService from './api.service';
import { ScreenGroup } from '../types/models/screen.group.ts';

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