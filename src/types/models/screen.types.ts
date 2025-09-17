// src/types/models/screen.types.ts



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
    settingsMetadata: Record<string, unknown>;
}

/**
 * Represents the count of screens by status.
 */
export interface ScreenStatusCountDTO {
    status: string;
    count: number;
}

/**
 * Represents a single playlist entry in the screen's queue.
 */
export interface PlaylistQueueItem {
    id: string;
    screenId: string;
    playlistId: string;
    queuePosition: number;
    isActive: boolean; // Indicates if this is the currently playing item in the queue
    screenName: string;
    playlistName: string;
}

/**
 * Represents the detailed structure of a playlist.
 */
export interface Playlist {
    id: string;
    name: string;
    playlistData: Record<string, unknown>;
    screenIds: string[];
    contentIds: string[];
    screenPlaylistQueues: PlaylistQueueItem[];
}

/**
 * Represents the complete screen model, matching the backend API response.
 */
export interface Screen {
    /** The unique identifier of the screen. Optional for new screens not yet saved. */
    id?: string;
    name: string;
    /** Location can be absent for unregistered or legacy screens */
    location?: Location;
    status: ScreenStatus;
    type: ScreenType;
    /** A flexible key-value store for screen-specific data like resolution, brightness etc. */
    metadata?: Record<string, unknown>;
    screenSettingsDTO?: ScreenSettings;
    playlistQueue: PlaylistQueueItem[];
    /** The playlist object that is currently active on the screen. Can be null if nothing is playing. */
    currentPlaylist: Playlist | null;
}

// Alias for backward compatibility
// export type Screen = ScreenDTO;

/**
 * Represents the live WebSocket connection status of a screen.
 */
export interface ScreenConnectionStatus {
    screenId: string;
    sessionId: string;
    /** The last heartbeat timestamp in ISO 8601 format (e.g., "2023-10-27T10:00:00Z"). */
    lastHeartbeat: string;
    connectionIp: string;
    clientInfo: string;
    connected: boolean;
}

/**
 * Represents the data payload required to create a new screen by linking it
 * to a physical device via its unique screen code. This type mirrors the
 * backend's `ScreenCreationDTO`.
 */
export interface ScreenCreation {
    /**
     * The unique code displayed on the physical screen.
     * Must be in the format XXXX-XXXX-XXXX.
     * @example "A4B1-C9D2-E7F3"
     */
    screenCode: string;
    name: string;
    location: Location;
    screenSettingsDTO?: ScreenSettings;
    status?: ScreenStatus;
    type?: ScreenType;
    metadata?: Record<string, unknown>;
}

// Alias for backward compatibility
export type ScreenCreationPayload = ScreenCreation;

/**
 * Lightweight DTO representing only the essential data needed for mapping screen locations.
 * Mirrors the backend's ScreenLocationDTO returned by GET /api/screens/locations.
 */
export interface ScreenLocation {
    id: string;
    screenCode?: string;
    name: string;
    location: Location;
}
