import apiService from './api.service';

export interface PlaylistData {
  id?: number;
  name: string;
  playlistData: any;
  screenIds: number[];
  contentIds: number[];
}

export const playlistService = {
  createPlaylist: async (playlist: Omit<PlaylistData, 'id'>): Promise<PlaylistData> => {
    return apiService.post<PlaylistData>('/api/playlist', playlist);
  },

  getPlaylistById: async (id: number): Promise<PlaylistData> => {
    return apiService.get<PlaylistData>(`/api/playlist/${id}`);
  },

  updatePlaylist: async (playlist: PlaylistData): Promise<PlaylistData> => {
    return apiService.post<PlaylistData>('/api/playlist/update', playlist);
  },

  deletePlaylist: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/playlist/${id}`);
  },

  publishPlaylist: async (playlist: PlaylistData): Promise<string> => {
    return apiService.post<string>('/api/playlist/publish', playlist);
  },

  publishPlaylistToScreen: async (playlistId: number, screenId: number): Promise<string> => {
    return apiService.post<string>(`/api/playlist/${playlistId}/publish/screen/${screenId}`);
  }
};

export default playlistService;