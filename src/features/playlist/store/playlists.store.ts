// src/features/playlist/store/playlists.store.ts

import {create} from 'zustand';
import {PlaylistDTO} from '../../../types/models/playlist.ts';
import {playlistService} from '../../../services/playlist.service';

// Define the shape of our state
interface PlaylistState {
    playlists: PlaylistDTO[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    searchQuery: string;
}

// Define the actions available to modify the state
interface PlaylistActions {
    setSearchQuery: (query: string) => void;
    setPage: (page: number) => void;
    fetchPlaylists: () => Promise<void>;
    deletePlaylist: (id: number) => Promise<void>;
}

// Create the Zustand store
export const usePlaylistsStore = create<PlaylistState & PlaylistActions>((set, get) => ({
    // Initial State
    playlists: [],
    isLoading: true,
    error: null,
    currentPage: 0, // API is 0-indexed
    totalPages: 0,
    itemsPerPage: 16,
    searchQuery: '',

    // Actions
    setSearchQuery: (query: string) => {
        // Reset to the first page whenever the search query changes
        set({searchQuery: query, currentPage: 0});
        // NOTE: We don't trigger a fetch here. The component's useEffect will handle it
        // if the search needs to be server-side in the future.
    },

    setPage: (page: number) => {
        set({currentPage: page});
    },

    fetchPlaylists: async () => {
        set({isLoading: true, error: null});
        const {currentPage, itemsPerPage, searchQuery} = get();
        try {
            // TODO: Add search query to the API call when the backend supports it
            // e.g., await playlistService.getAllPlaylist(currentPage, itemsPerPage, searchQuery);
            const response = await playlistService.getAllPlaylist(currentPage, itemsPerPage);

            if (response.success) {
                set({
                    playlists: response.data.content,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch playlists');
            }
        } catch (err) {
            console.error("Error fetching playlists:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            set({error: errorMessage, isLoading: false});
        }
    },

    deletePlaylist: async (id: number) => {
        // Keep the current playlists to revert in case of an error
        const originalPlaylists = get().playlists;

        // Optimistic update: remove the playlist from the UI immediately
        set(state => ({
            playlists: state.playlists.filter(playlist => playlist.id !== id)
        }));

        try {
            await playlistService.deletePlaylist(id);
            // On success, we could optionally re-fetch to ensure data consistency,
            // but for a simple delete, the optimistic update is often enough.
            // get().fetchPlaylists();
        } catch (err) {
            console.error('Error deleting playlist:', err);
            // If the API call fails, revert the change and set an error message
            set({
                playlists: originalPlaylists,
                error: 'Failed to delete playlist. Please try again.'
            });
        }
    },
}));