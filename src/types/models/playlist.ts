// src/types/models/playlist.ts

export interface PlaylistDTO {
    id: number;
    name: string;
    description?: string;
    playlistData: {
        loop: boolean;
        duration: number;
        transition: string;
    };
    screenIds: number[];
    playlistItems: PlaylistItemDTO[];
    contentIds?: number[];
    screenPlaylistQueues: ScreenPlaylistQueueDTO[];
}

export interface PlaylistItemDTO {
    type: 'content' | 'spotify';
    contentId?: number;
    spotifyId?: string;
    name: string;
    duration: number;
    playOrder: number; // Ensure playOrder is required
    thumbnailUrl?: string;
    url?: string;
    // Spotify-specific fields
    uri?: string;
    album?: any;
    artists?: any[];
    preview_url?: string;
    external_urls?: any;
    // Content-specific fields
    contentType?: string;
    metadata?: any;
}

// ... rest of the types remain the same ...

// Strict type for screen playlist queue entries
export interface ScreenPlaylistQueueDTO {
    id: number;
    screenId: number;
    playlistId: number;
    queuePosition: number;
    isActive: boolean;
    screenName: string;
    playlistName: string;
}

// A generic type for Spring's Page object
export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    empty: boolean;
}

// Your existing ApiResponse, now made generic
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: number;
    path?: string;
}