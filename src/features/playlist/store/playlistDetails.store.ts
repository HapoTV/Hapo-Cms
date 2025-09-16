// src/features/playlist/store/playlistDetails.store.ts

import { create } from 'zustand';
import { toast } from 'react-toastify';

import { playlistService } from '../services/playlist.service';
import { contentService } from '../../../services/content.service';

import { ContentItem } from '../types';
import { PlaylistDTO } from '../../../types/models/playlist';

// A PlaylistItem is a full Content object with a specific duration for this playlist.
export interface PlaylistItem extends ContentItem {
    thumbnailUrl: string;
    duration: number; // Playlist-specific override
}

interface PlaylistDetailsState {
    playlist: PlaylistDTO | null;
    items: PlaylistItem[]; // Ordered content items
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    totalDuration: number;
}

interface PlaylistDetailsActions {
    fetchPlaylistDetails: (id: string) => Promise<void>;
    savePlaylist: () => Promise<boolean>;
    updateItemDuration: (itemId: string, change: number) => void;
    reorderItems: (newlyOrderedItems: PlaylistItem[]) => void;
    addItem: (item: ContentItem, duration: number) => void;
    removeItem: (itemId: string) => void;
    clearState: () => void;
}

const initialState: PlaylistDetailsState = {
    playlist: null,
    items: [],
    isLoading: true,
    isSaving: false,
    error: null,
    totalDuration: 0,
};

// Helper to calculate total duration
const calculateTotalDuration = (items: PlaylistItem[]) =>
    items.reduce((total, item) => total + (item.duration || 0), 0);

export const usePlaylistDetailsStore = create<PlaylistDetailsState & PlaylistDetailsActions>((set, get) => ({
    ...initialState,

    fetchPlaylistDetails: async (id: string) => {
        set({ ...initialState, isLoading: true });
        try {
            // Step 1: Fetch the main playlist object
            const playlistResponse = await playlistService.getPlaylistById(id);
            if (!playlistResponse.success || !playlistResponse.data) {
                throw new Error(playlistResponse.message);
            }

            const playlist = playlistResponse.data;
            let finalItems: PlaylistItem[] = [];

            // Step 2: Fetch content if playlist has contentIds
            if (playlist.contentIds && playlist.contentIds.length > 0) {
                const contentPromises = playlist.contentIds.map(contentId =>
                    contentService.getContentById(contentId)
                );

                const contentResults = await Promise.allSettled(contentPromises);

                finalItems = contentResults
                    .filter((result): result is PromiseFulfilledResult<ContentItem> => result.status === 'fulfilled')
                    .map(result => result.value)
                    .map(content => ({
                        ...content,
                        duration: content.defaultDuration || 10,
                        thumbnailUrl: content.thumbnailUrl || ''
                    }));
            }

            set({
                playlist,
                items: finalItems,
                isLoading: false,
                totalDuration: calculateTotalDuration(finalItems),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            set({
                isLoading: false,
                error: message
            });
        }
    },

    savePlaylist: async () => {
        const { playlist, items } = get();
        if (!playlist) return false;

        set({ isSaving: true });
        try {
            const updatedPlaylistData: PlaylistDTO = {
                ...playlist,
                contentIds: items.map(item => item.id.toString()), // Ensure UUIDs as strings
                playlistData: {
                    ...playlist.playlistData,
                    duration: calculateTotalDuration(items),
                },
            };

            // Exclude screenPlaylistQueues when sending update
            const { screenPlaylistQueues, ...cleanedData } = updatedPlaylistData;

            const response = await playlistService.updatePlaylist(cleanedData);
            if (!response.success) throw new Error(response.message);

            set({ isSaving: false, error: null, playlist: response.data });
            toast.success("Playlist saved successfully!");
            return true;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            set({ isSaving: false, error: message });
            toast.error(`Save failed: ${message}`);
            return false;
        }
    },

    updateItemDuration: (itemId: string, change: number) => {
        set(state => {
            const updatedItems = state.items.map(item =>
                item.id === itemId
                    ? { ...item, duration: Math.max(1, item.duration + change) }
                    : item
            );
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    },

    reorderItems: (newlyOrderedItems: PlaylistItem[]) => {
        set({
            items: newlyOrderedItems,
            totalDuration: calculateTotalDuration(newlyOrderedItems),
        });
    },

    addItem: (item: ContentItem, duration: number) => {
        set(state => {
            const newItem: PlaylistItem = { ...item, duration, thumbnailUrl: item.thumbnailUrl || '' };
            const updatedItems = [...state.items, newItem];
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    },

    removeItem: (itemId: string) => {
        set(state => {
            const updatedItems = state.items.filter(item => item.id !== itemId);
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    },

    clearState: () => {
        set({ ...initialState, isLoading: false });
    },
}));
