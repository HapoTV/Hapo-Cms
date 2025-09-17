// src/types/models/playlist.ts

export interface PlaylistDTO {
    id: string; // UUID now
    name: string;
    description?: string;
    playlistData: {
        loop: boolean;
        duration: number;
        transition: string;
    };
    screenIds: string[]; // UUIDs
    playlistItems: PlaylistItemDTO[];
    contentIds?: string[]; // UUIDs
    screenPlaylistQueues: ScreenPlaylistQueueDTO[];
}

export interface PlaylistItemDTO {
    type: 'content' | 'spotify';
    contentId?: string; // UUID
    spotifyId?: string;
    name: string;
    duration: number;
    playOrder: number;
    thumbnailUrl?: string;
    url?: string;
    uri?: string;
    album?: any;
    artists?: any[];
    preview_url?: string;
    external_urls?: any;
    contentType?: string;
    metadata?: any;
}

export interface ScreenPlaylistQueueDTO {
    id: string;
    screenId: string;
    playlistId: string;
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