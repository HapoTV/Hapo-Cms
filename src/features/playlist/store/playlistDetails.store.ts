// src/features/playlist/store/playlistDetails.store.ts

import {create} from 'zustand';
import {PlaylistDTO} from '../../../types/models/playlist'; // Assuming you have this
import {ContentItem} from '../../../types/models/ContentItem';
import {playlistService} from '../../../services/playlist.service';
import {contentService} from '../../../services/content.service';
import {toast} from 'react-toastify'; // Using a library like react-toastify is great for feedback

// A PlaylistItem is a full Content object with a specific duration for this playlist.
export interface PlaylistItem extends ContentItem {
    // The playlist might override the default duration of the content
    duration: number;
}

interface PlaylistDetailsState {
    playlist: PlaylistDTO | null;
    items: PlaylistItem[]; // This will hold the ordered content items
    isLoading: boolean;
    isSaving: boolean; // <-- ADDED: For tracking save state
    error: string | null;
    totalDuration: number;
}

interface PlaylistDetailsActions {
    fetchPlaylistDetails: (id: number) => Promise<void>;
    savePlaylist: () => Promise<boolean>; // <-- ADDED: Save action, returns true on success
    updateItemDuration: (itemId: number, change: number) => void;
    // ... other actions
    clearState: () => void;
}

const initialState: PlaylistDetailsState = {
    playlist: null,
    items: [],
    isLoading: true,
    error: null,
    totalDuration: 0,
};

// Helper to calculate total duration
const calculateTotalDuration = (items: PlaylistItem[]) => {
    return items.reduce((total, item) => total + item.duration, 0);
};

export const usePlaylistDetailsStore = create<PlaylistDetailsState & PlaylistDetailsActions>((set, get) => ({
    ...initialState,

    fetchPlaylistDetails: async (id: number) => {
        set({...initialState, isLoading: true});
        try {
            // Step 1: Fetch the main playlist object
            const playlistResponse = await playlistService.getPlaylistById(id);
            if (!playlistResponse.success || !playlistResponse.data) throw new Error(playlistResponse.message);

            const playlist = playlistResponse.data;
            let finalItems: PlaylistItem[] = [];

            // Step 2: If there are content IDs, fetch the corresponding content
            if (playlist.contentIds && playlist.contentIds.length > 0) {
                // Assuming contentService has a method to fetch multiple items by their IDs
                const contentResponse = await contentService.getContentsByIds(playlist.contentIds);
                if (!contentResponse.success) throw new Error(contentResponse.message);

                const contentMap = new Map(contentResponse.data.map(c => [c.id, c]));

                // BUG FIX: The result of .map was being assigned to a local `items`, not `finalItems`.
                finalItems = playlist.contentIds.map(contentId => {
                    const content = contentMap.get(contentId);
                    if (!content) return null;
                    return {...content, duration: content.defaultDuration || 10};
                }).filter((item): item is PlaylistItem => item !== null);
            }

            set({
                playlist,
                items: finalItems, // Use the correctly populated array
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

    // NEW ACTION: To save the changes back to the server
    savePlaylist: async () => {
        const {playlist, items} = get();
        if (!playlist) return false;

        set({isSaving: true});
        try {
            const updatedPlaylistData = {
                ...playlist,
                contentIds: items.map(item => item.id), // Use current items to get ordered IDs
                playlistData: {
                    ...playlist.playlistData,
                    duration: calculateTotalDuration(items), // Recalculate total duration
                },
            };

            // The API might not want this part of the object back, so we remove it.
            // Using a type assertion with a more specific type
            const playlistWithQueues = updatedPlaylistData as PlaylistDTO & { screenPlaylistQueues?: unknown };
            delete playlistWithQueues.screenPlaylistQueues;

            // Call updatePlaylist with the correct signature (just the playlist object)
            const response = await playlistService.updatePlaylist(updatedPlaylistData);
            if (!response.success) throw new Error(response.message);

            set({isSaving: false, error: null, playlist: response.data});
            toast.success("Playlist saved successfully!");
            return true; // Indicate success

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            set({isSaving: false, error: message});
            toast.error(`Save failed: ${message}`);
            return false; // Indicate failure
        }
    },

    updateItemDuration: (itemId: number, change: number) => {
        set(state => {
            const updatedItems = state.items.map(item =>
                item.id === itemId
                    ? {...item, duration: Math.max(1, item.duration + change)}
                    : item
            );
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    },

    reorderItems: (newlyOrderedItems: PlaylistItem[]) => {
        set({items: newlyOrderedItems});
    },

    clearState: () => {
        set({...initialState, isLoading: false});
    },

    addItem: (item: ContentItem, duration: number) => {
        set(state => {
            const newItem: PlaylistItem = {...item, duration};
            const updatedItems = [...state.items, newItem];
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    },

    removeItem: (itemId: number) => {
        set(state => {
            const updatedItems = state.items.filter(item => item.id !== itemId);
            return {
                items: updatedItems,
                totalDuration: calculateTotalDuration(updatedItems),
            };
        });
    }
}));
