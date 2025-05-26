import apiService from './api.service';

export interface ScreenPlaylistQueue {
  id?: number;
  screenId: number;
  playlistId: number;
  queuePosition: number;
  isActive: boolean;
  screenName?: string;
  playlistName?: string;
}

export const screenPlaylistQueueService = {
  getPlaylistQueue: async (screenId: number): Promise<ScreenPlaylistQueue[]> => {
    return apiService.get<ScreenPlaylistQueue[]>(`/api/screen-playlist-queue/screen/${screenId}`);
  },

  addPlaylistToQueue: async (screenId: number, playlistId: number): Promise<string> => {
    return apiService.post<string>(`/api/screen-playlist-queue/screen/${screenId}/playlist/${playlistId}`);
  },

  removePlaylistFromQueue: async (screenId: number, playlistId: number): Promise<string> => {
    return apiService.delete<string>(`/api/screen-playlist-queue/screen/${screenId}/playlist/${playlistId}`);
  },

  movePlaylistInQueue: async (screenId: number, playlistId: number, position: number): Promise<string> => {
    return apiService.put<string>(
      `/api/screen-playlist-queue/screen/${screenId}/playlist/${playlistId}/position/${position}`
    );
  },

  setCurrentPlaylist: async (screenId: number, playlistId: number): Promise<string> => {
    return apiService.put<string>(
      `/api/screen-playlist-queue/screen/${screenId}/current-playlist/${playlistId}`
    );
  }
};

export default screenPlaylistQueueService;