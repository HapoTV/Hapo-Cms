// src/features/playlist/services/playlist.service.ts

import apiService from '../../../services/api.service';
import {ApiResponse, Page, PlaylistDTO} from '../types';

// The data type we expect from the /summaries endpoint
type PaginatedPlaylistsResponse = ApiResponse<Page<PlaylistDTO>>;

/**
 * Service for all playlist-related API calls.
 * Follows the endpoints defined in the PlaylistController.
 */
export const playlistService = {
    /**
     * Creates a new playlist.
     * Corresponds to: POST /api/playlists
     */
    createPlaylist: async (playlist: Omit<PlaylistDTO, 'id'>): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.post<ApiResponse<PlaylistDTO>>('/api/playlists', playlist);
    },

    /**
     * Fetches a single playlist by its ID.
     * Corresponds to: GET /api/playlists/{id}
     */
    getPlaylistById: async (id: number): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.get<ApiResponse<PlaylistDTO>>(`/api/playlists/${id}`);
    },

    /**
     * Fetches a paginated list of playlist summaries.
     * @param page - The page number to fetch (0-indexed).
     * @param size - The number of items per page.
     */
    getAllPlaylist: async (page: number, size: number): Promise<PaginatedPlaylistsResponse> => {
        return apiService.get<PaginatedPlaylistsResponse>(`/api/playlists/summaries?page=${page}&size=${size}`);
    },

    /**
     * Updates the core details of a playlist (e.g., name, description).
     * NOTE: This follows the REST standard. Your Java controller must be updated.
     * Change `@PatchMapping("/update")` to `@PatchMapping("/{id}")`.
     * Corresponds to: PATCH /api/playlists/{id}
     */
    updatePlaylist: async (playlist: PlaylistDTO): Promise<ApiResponse<PlaylistDTO>> => {
        // The ID must be part of the URL for a PATCH/PUT request.
        if (!playlist.id) throw new Error("Playlist ID is required for update.");
        return apiService.patch<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlist.id}`, playlist);
    },

    /**
     * Deletes a playlist by its ID.
     * Corresponds to: DELETE /api/playlists/{id}
     */
    deletePlaylist: async (id: number): Promise<ApiResponse<string>> => {
        return apiService.delete<ApiResponse<string>>(`/api/playlists/${id}`);
    },

    /**
     * Replaces the entire list of items in a playlist with a new list.
     * The order of content IDs determines the playback order.
     * Corresponds to: PUT /api/playlists/{playlistId}/items
     */
    updatePlaylistItems: async (playlistId: number, contentIds: number[]): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.put<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlistId}/items`, contentIds);
    },

    /**
     * Adds a single content item to the end of a playlist.
     * Corresponds to: POST /api/playlists/{playlistId}/items/{contentId}
     */
    addItemToPlaylist: async (playlistId: number, contentId: number): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.post<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlistId}/items/${contentId}`);
    },

    /**
     * Removes a single content item from a playlist.
     * Corresponds to: DELETE /api/playlists/{playlistId}/items/{contentId}
     */
    removeItemFromPlaylist: async (playlistId: number, contentId: number): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.delete<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlistId}/items/${contentId}`);
    },

    /**
     * Moves an item to a specific position (0-based index) in a playlist.
     * Corresponds to: PUT /api/playlists/{playlistId}/items/{contentId}/position/{position}
     */
    moveItemInPlaylist: async (playlistId: number, contentId: number, position: number): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.put<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlistId}/items/${contentId}/position/${position}`);
    },

    /**
     * Updates the custom duration for a specific item within a playlist.
     * Corresponds to: PATCH /api/playlists/{playlistId}/items/{contentId}/duration/{duration}
     */
    updateItemDuration: async (playlistId: number, contentId: number, duration: number): Promise<ApiResponse<PlaylistDTO>> => {
        return apiService.patch<ApiResponse<PlaylistDTO>>(`/api/playlists/${playlistId}/items/${contentId}/duration/${duration}`);
    },

    /**
     * Publishes a playlist to a list of specified screens.
     * Corresponds to: POST /api/playlists/publish
     */
    publishPlaylist: async (playlist: PlaylistDTO): Promise<ApiResponse<string>> => {
        return apiService.post<ApiResponse<string>>('/api/playlists/publish', playlist);
    },

    /**
     * Publishes a playlist to a single screen.
     * Corresponds to: POST /api/playlists/{playlistId}/publish/screen/{screenId}
     */
    publishPlaylistToScreen: async (playlistId: number, screenId: number): Promise<ApiResponse<string>> => {
        return apiService.post<ApiResponse<string>>(`/api/playlists/${playlistId}/publish/screen/${screenId}`);
    }
};

export default playlistService;
