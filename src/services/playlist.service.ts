import apiService from './api.service';
import {ApiResponse, Page, PlaylistDTO} from '../types/api.types';

// The data type we expect from the /summaries endpoint
type PaginatedPlaylistsResponse = ApiResponse<Page<PlaylistDTO>>;


export const playlistService = {
    createPlaylist: async (playlist: Omit<PlaylistDTO, 'id'>): Promise<PlaylistDTO> => {
        return apiService.post<PlaylistDTO>('/api/playlist', playlist);
    },

    getPlaylistById: async (id: number): Promise<ApiResponse<PlaylistDTO>> => {
        try {
            const playlist = await apiService.get<PlaylistDTO>(`/api/playlist/${id}`);
            return {
                success: true,
                message: 'Playlist fetched successfully',
                data: playlist,
                timestamp: Date.now(),
                path: `/api/playlist/${id}`
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch playlist',
                data: null as unknown as PlaylistDTO, // Type assertion to satisfy the return type
                timestamp: Date.now(),
                path: `/api/playlist/${id}`
            };
        }
  },

    /**
     * Fetches a paginated list of playlist summaries.
     * @param page - The page number to fetch (0-indexed).
     * @param size - The number of items per page.
     */
    getAllPlaylist: async (page: number, size: number): Promise<PaginatedPlaylistsResponse> => {
        // Pass page and size as query parameters
        return apiService.get<PaginatedPlaylistsResponse>(`/api/playlist/summaries?page=${page}&size=${size}`);
  },

    updatePlaylist: async (playlist: PlaylistDTO): Promise<PlaylistDTO> => {
        return apiService.post<PlaylistDTO>('/api/playlist/update', playlist);
  },

  deletePlaylist: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/playlist/${id}`);
  },

    publishPlaylist: async (playlist: PlaylistDTO): Promise<string> => {
    return apiService.post<string>('/api/playlist/publish', playlist);
  },

  publishPlaylistToScreen: async (playlistId: number, screenId: number): Promise<string> => {
    return apiService.post<string>(`/api/playlist/${playlistId}/publish/screen/${screenId}`);
  }
};

export default playlistService;
