/* AUTO-GENERATED FILE. DO NOT EDIT. */

// A reusable type for screen status, ensuring consistency across the app.
export type ScreenStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING' | 'UNREGISTERED';

// A reusable type for the screen's platform/OS.
export type ScreenType = 'WINDOWS' | 'MAC' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB' | 'OTHER';

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    timestamp?: number;
    path?: string;
}

export interface AuthenticationResponse {
    token?: string;
    refreshToken?: string;
    user?: User;
}

export interface Content {
    id?: string;
    name?: string;
    type?: string;
    url?: string;
    tags?: Record<string, unknown>;
    duration?: number;
    uploadDate?: string;
    metadata?: Record<string, unknown>;
    campaignId?: string;
    screenIds?: string[];
}

export interface ContentRequest {
    name: string;
    type: string;
    tags: Record<string, string>;
    duration: number;
    metadata: Record<string, string>;
    campaignId: string;
    screenIds: string[];
}

export interface ContentResponse {
    name?: string;
    type?: string;
    tags?: Record<string, string>;
    metadata?: Record<string, string>;
    campaignId?: number;
    screenIds?: string;
    duration?: number;
    url?: string;
    uploadDate?: string;
}

export interface ContentTOScreens {
    id?: string;
    name?: string;
    type?: string;
    url?: string;
    tags?: Record<string, unknown>;
    duration?: number;
    uploadDate?: string;
    metadata?: Record<string, unknown>;
    campaignId?: string;
    screenIds?: string[];
}

export interface EmergencyBroadcastRequestDTO {
    message?: string;
    screenIds?: string[];
}

export interface EmergencyMessage {
    message?: string;
}

export interface ErrorDTO {
    timestamp?: string;
    status: number;
    error?: string;
    message?: string;
    path?: string;
    errors?: Record<string, string>;
}

export interface ErrorResponse {
    timestamp?: string;
    status: number;
    error?: string;
    message?: string;
    path?: string;
    errors?: Record<string, string>;
}

export interface Location {
    name?: string;
    latitude: number;
    longitude: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LogoutResponse {
    message?: string;
}

export interface Playlist {
    id: string;
    name?: string;
    description?: string;
    playlistData?: Record<string, unknown>;
    screenIds?: string[];
    playlistItems?: PlaylistItem[];
    contentIds?: string[];
    screenPlaylistQueues?: ScreenPlaylistQueue[];
}

export interface PlaylistItem {
    id: string;
    playlistId: string;
    contentId: string;
    playOrder?: number;
    customDuration?: number;
    spotifyId?: string;
    spotifyTrackName?: string;
    spotifyArtistName?: string;
    spotifyDurationMs?: number;
    spotifyPreviewUrl?: string;
    spotifyImageUrl?: string;
    isSpotifyContent?: boolean;
    name?: string;
    duration?: number;
    thumbnailUrl?: string;
    url?: string;
    type?: string;
    metadata?: string;
}

export interface PlaylistSummary {
    id: string;
    name?: string;
    playlistItemCount: number;
    playlistScreenCount: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface Schedule {
    id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isRecurring?: boolean;
    recurrencePattern?: string;
    timeSlots?: string[];
    weeklySchedule?: Record<string, string[]>;
    priority?: string;
    metadata?: Record<string, unknown>;
    screenIds?: string[];
    screenGroupIds?: string[];
    playlistIds?: string[];
    version?: number;
}

export interface ScreenCreation {
    screenCode: string;
    name?: string;
    location?: Location;
    status?: string;
    type?: string;
    metadata?: Record<string, unknown>;
    screenSettingsDTO?: ScreenSettings;
}


export interface Screen {
    id: string;
    screenCode?: string;
    name: string;
    location?: Location;
    status: string;
    type?: string;
    metadata?: Record<string, unknown>;
    screenSettingsDTO?: ScreenSettings;
    playlistQueue?: ScreenPlaylistQueue[];
    currentPlaylist?: Playlist;
}

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

export interface ScreenGroup {
    id: string;
    name?: string;
    description?: string;
    screenIds: string[];
    parentGroupId: string;
    subGroupIds: string[];
    metadata?: Record<string, unknown>;
    defaultPlaylistId?: string;
    version?: number;
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

export interface ScreenPlaylistQueue {
    id: string;
    screenId?: string;
    playlistId?: string;
    queuePosition?: number;
    isActive?: boolean;
    screenName?: string;
    playlistName?: string;
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

export interface ScreenSettings {
    loop?: boolean;
    cacheMedia: boolean;
    fallbackToCache: boolean;
    settingsMetadata?: Record<string, unknown>;
}

export interface ScreenStatusCount {
    status?: string;
    count?: number;
}

export interface SpotifyContent {
    id: string;
    playlistItemId?: string;
    spotifyTrackId?: string;
    spotifyTrackName?: string;
    spotifyArtistName?: string;
    spotifyDurationMs?: number;
    spotifyPreviewUrl?: string;
    spotifyImageUrl?: string;
}

export interface SpotifyTrack {
    id: string;
    name?: string;
    duration?: string;
    uri?: string;
    previewUrl?: string;
    artists?: string[];
    album?: string;
}

export interface User {
    email?: string;
    username?: string;
    roles?: string[];
    lastActive?: string;
}

export interface LogoutRequest {
    token: string;
    refreshToken: string;
}

