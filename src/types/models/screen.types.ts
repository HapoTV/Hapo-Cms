// src/types/models/screen.types.ts

// A reusable type for screen status, ensuring consistency across the app.
export type ScreenStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING' | 'UNREGISTERED';

// A reusable type for the screen's platform/OS.
export type ScreenType = 'WINDOWS' | 'MAC' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB' | 'OTHER';

/**
 * Represents a geographical location with a name and coordinates.
 */
export interface Location {
    name: string;
    latitude: number;
    longitude: number;
}

/**
 * Defines the playback and caching settings for a screen.
 * This type maps directly to the `screenSettingsDTO` from the backend.
 */
export interface ScreenSettings {
    loop: boolean;
    cacheMedia: boolean;
    fallbackToCache: boolean;
    /** A flexible key-value store for additional custom settings. */
    settingsMetadata: Record<string, unknown>; // UPDATED: Matches `settingsMetadata` in JSON
}

export interface ScreenConnectionStatus {
    Status: ScreenStatus;
    count: number;
}

/**
 * NEW: Represents a single playlist entry in the screen's queue.
 */
export interface PlaylistQueueItem {
    id: number;
    screenId: number;
    playlistId: number;
    queuePosition: number;
    isActive: boolean; // Indicates if this is the currently playing item in the queue
    screenName: string;
    playlistName: string;
}

/**
 * NEW: Represents the detailed structure of the currently playing playlist.
 */
export interface CurrentPlaylist {
    id: number;
    name: string;
    playlistData: {
        loop: boolean;
        duration: number;
        transition: string;
    };
    screenIds: number[];
    contentIds: number[];
    // This nested array shows all screens this playlist is queued on, not just the current one.
    screenPlaylistQueues: PlaylistQueueItem[];
}


/**
 * Represents the complete screen model, matching the backend API response.
 */
export interface Screen {
    /** The unique identifier of the screen. Optional for new screens not yet saved. */
    id?: number;
    name: string;
    location: Location;
    status: ScreenStatus;
    type: ScreenType;
    /** A flexible key-value store for screen-specific data like resolution, brightness etc. */
    metadata: Record<string, unknown>;
    screenSettingsDTO: ScreenSettings; // UPDATED: Uses the corrected ScreenSettings interface
    playlistQueue: PlaylistQueueItem[]; // UPDATED: Uses the new detailed type
    /** The playlist object that is currently active on the screen. Can be null if nothing is playing. */
    currentPlaylist: CurrentPlaylist | null; // UPDATED: This is the most important change
}

/**
 * Represents the live WebSocket connection status of a screen.
 */
export interface ScreenConnectionStatus {
    screenId: number;
    sessionId: string;
    /** The last heartbeat timestamp in ISO 8601 format (e.g., "2023-10-27T10:00:00Z"). */
    lastHeartbeat: string;
    connectionIp: string;
    clientInfo: string;
    connected: boolean;
}