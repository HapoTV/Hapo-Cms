// This file should be renamed to playlists.store.ts as it contains a store, not a service
// For now, we'll update the imports to avoid circular references

import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {playlistService} from '../../../services/playlist.service';
import type {Playlist} from '../types';

interface PlaylistsState {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (playlist: Omit<Playlist, 'id'>) => Promise<void>;
  updatePlaylist: (id: string, playlist: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
}

export const usePlaylistsStore = create<PlaylistsState>()(
  devtools(
    (set, get) => ({
      playlists: [],
      selectedPlaylist: null,
      isLoading: false,
      error: null,

      fetchPlaylists: async () => {
        try {
          set({ isLoading: true, error: null });
          const playlists = await playlistService.getPlaylists();
          set({ playlists, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch playlists', isLoading: false });
            console.error("Error fetching playlists:", error);
        }
      },

      createPlaylist: async (playlist) => {
        try {
          set({ isLoading: true, error: null });
          const newPlaylist = await playlistService.createPlaylist(playlist);
          set(state => ({
            playlists: [...state.playlists, newPlaylist],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to create playlist', isLoading: false });
          throw error;
        }
      },

      updatePlaylist: async (id, playlist) => {
        try {
          set({ isLoading: true, error: null });
          const updatedPlaylist = await playlistService.updatePlaylist(id, playlist);
          set(state => ({
            playlists: state.playlists.map(p => p.id === id ? updatedPlaylist : p),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update playlist', isLoading: false });
          throw error;
        }
      },

      deletePlaylist: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await playlistService.deletePlaylist(id);
          set(state => ({
            playlists: state.playlists.filter(p => p.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to delete playlist', isLoading: false });
          throw error;
        }
      },

      setSelectedPlaylist: (playlist) => set({ selectedPlaylist: playlist })
    }),
    {
      name: 'playlists-store'
    }
  )
);
