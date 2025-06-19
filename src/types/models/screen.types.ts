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
 */
export interface ScreenSettings {
    loop: boolean;
    cacheMedia: boolean;
    fallbackToCache: boolean;
    /** A flexible key-value store for additional custom settings. Safer than 'any'. */
    metadata: Record<string, unknown>;
}

export interface ScreenConnectionStatus {
    Status: ScreenStatus;
    count: number;
}

// A reusable type for screen status, ensuring consistency across the app.
export type ScreenStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING'| 'UNREGISTERED';

// A reusable type for the screen's platform/OS.
export type ScreenType = 'WINDOWS' | 'MAC' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB' | 'OTHER';

/**
 * Represents the core screen model in the application.
 */
export interface Screen {
    /** The unique identifier of the screen. Optional for new screens not yet saved. */
    id?: number;
    name: string;
    location: Location;
    status: ScreenStatus; // <-- CHANGED: Now includes 'PENDING' for consistency.
    type: ScreenType;
    /** A flexible key-value store for additional custom screen data. */
    metadata: Record<string, unknown>; // <-- CHANGED: Safer than 'any'.
    settings: ScreenSettings; // <-- CHANGED: Renamed from screenSettingsDTO for cleaner frontend code.
}

/**
 * Represents the live connection status of a screen.
 */
export interface ScreenConnectionStatus {
    screenId: number;
    sessionId: string;
    /** The last heartbeat timestamp in ISO 8601 format (e.g., "2023-10-27T10:00:00Z"). */
    lastHeartbeat: string; // <-- UNCHANGED, but added a clarifying comment.
    connectionIp: string;
    clientInfo: string;
    connected: boolean;
}