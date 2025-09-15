// src/services/spotify.service.ts
import apiService from './api.service';
import { SpotifyTrack } from '../types/models/Spotify';



export const spotifyService = {
  searchTracks: async (query: string, limit: number = 10): Promise<SpotifyTrack[]> => {
    const response = await apiService.get<any>(
      `/api/spotify/search/tracks?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    // Return as SpotifyTrack array
    return Array.isArray(response) ? response : response.tracks?.items || [];
  },

  getTrack: async (trackId: string): Promise<SpotifyTrack> => {
    return await apiService.get<SpotifyTrack>(`/api/spotify/tracks/${trackId}`);
  },

  getAlbum: async (albumId: string): Promise<any> => {
    return await apiService.get<any>(`/api/spotify/albums/${albumId}`);
  },

  getArtist: async (artistId: string): Promise<any> => {
    return await apiService.get<any>(`/api/spotify/artists/${artistId}`);
  },

  getArtistTopTracks: async (artistId: string, market: string = 'US'): Promise<SpotifyTrack[]> => {
    const response = await apiService.get<any>(`/api/spotify/artists/${artistId}/top-tracks?market=${market}`);
    return response.tracks || response;
  },
};

export default spotifyService;