// Type for the Playlist DTO based on your JSON
export interface PlaylistDTO {
    id: number;
    name: string;
    playlistData: {
        loop: boolean;
        duration: number; // e.g., 3600
        transition: string;
    };
    screenIds: number[];
    contentIds: number[];

    // Typed according to ScreenPlaylistQueueDTO structure
    screenPlaylistQueues: ScreenPlaylistQueueDTO[];
}

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
        // ... other pageable properties
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number; // The current page number (0-indexed)
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