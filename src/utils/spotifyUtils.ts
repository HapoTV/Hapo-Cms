// src/utils/spotifyUtils.ts
import { SpotifyTrack } from '../types/models/Spotify';
import { ContentItem } from '../types/models/ContentItem';

export const convertSpotifyTrackToContentItem = (track: SpotifyTrack): ContentItem => {
    return {
        id: parseInt(track.id),
        name: track.name,
        type: 'AUDIO',
        url: track.preview_url || '',
        duration: Math.floor(track.duration_ms / 1000),
        metadata: {
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            spotifyId: track.id,
            spotifyUrl: track.external_urls.spotify,
            thumbnailUrl: track.album.images[0]?.url,
            durationMs: track.duration_ms,
            previewUrl: track.preview_url
        },
        tags: {
            source: 'spotify',
            genre: 'music',
            artist: track.artists[0]?.name || 'Unknown'
        },
        thumbnailUrl: track.album.images[0]?.url
    };
};

export const isSpotifyTrack = (item: any): item is SpotifyTrack => {
    return item && item.album && item.artists && item.duration_ms !== undefined;
};