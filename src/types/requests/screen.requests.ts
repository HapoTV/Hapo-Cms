// src/types/requests/screen.requests.ts

import type {Location, ScreenSettings, ScreenStatus, ScreenType} from '../models/screen.types';

/**
 * Represents the data payload required to create a new screen by linking it
 * to a physical device via its unique screen code. This type mirrors the

 * backend's `ScreenCreationDTO`.
 */
export interface ScreenCreationPayload {
    /**
     * The unique code displayed on the physical screen.
     * Must be in the format XXXX-XXXX-XXXX.
     * @example "A4B1-C9D2-E7F3"
     */
    screenCode: string;

    /**
     * The user-friendly name for the screen (e.g., "Lobby Display 1").
     * This is typically required in the creation form.
     */
    name: string;

    /**
     * The geographical location object for the screen.
     * This is also typically required in the creation form.
     */
    location: Location;

    /**
     * The initial settings for the screen. While the entire object can be sent,
     * it's often optional, as the backend will apply default settings.
     * The property name `screenSettingsDTO` is used to match the backend DTO exactly.
     */
    screenSettingsDTO?: ScreenSettings;

    // --- Fields often set by the backend or during a later step ---

    /**
     * The initial status of the screen.
     * Optional: If not provided, the backend will likely default to 'PENDING' or 'OFFLINE'.
     */
    status?: ScreenStatus;

    /**
     * The screen's operating system/platform.
     * Optional: This is often reported by the screen client itself after connecting,
     * so it's not usually part of the initial manual creation form.
     */
    type?: ScreenType;

    /**
     * A flexible key-value store for additional custom data.
     * Optional: Can be left empty on creation.
     */
    metadata?: Record<string, unknown>;
}