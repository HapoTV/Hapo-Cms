// src/features/screens/types/screen-details.types.ts

import {z} from 'zod';
// Import types from existing files
import type {Screen, ScreenConnectionStatus, ScreenSettings} from '../../../types';

// Form validation schema
export const settingsFormSchema = z.object({
    loop: z.boolean(),
    cacheMedia: z.boolean(),
    fallbackToCache: z.boolean(),
    settingsMetadata: z.object({
        brightness: z.coerce.number().min(0).max(100),
        volume: z.coerce.number().min(0).max(100),
        powerSaving: z.boolean(),
        contrast: z.coerce.number().min(0).max(100),
        autoPlay: z.boolean(),
        transitionDuration: z.coerce.number().min(0),
        updateInterval: z.coerce.number().min(1),
        offlineMode: z.boolean(),
        restartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
        autoUpdate: z.boolean(),
        resolution: z.string().optional(),
        refreshRate: z.string().optional(),
    }),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

// Supported options
export const SUPPORTED_RESOLUTIONS = [
    {value: '1920x1080', label: '1920 × 1080 (Full HD)'},
    {value: '2560x1440', label: '2560 × 1440 (2K)'},
    {value: '3840x2160', label: '3840 × 2160 (4K)'},
    {value: '1366x768', label: '1366 × 768 (HD)'},
    {value: '1280x720', label: '1280 × 720 (HD)'},
];

export const SUPPORTED_REFRESH_RATES = [
    {value: '30', label: '30 Hz'},
    {value: '60', label: '60 Hz'},
    {value: '75', label: '75 Hz'},
    {value: '120', label: '120 Hz'},
    {value: '144', label: '144 Hz'},
];

// Component prop types
export interface ScreenInfoProps {
    screen: Screen;
}

export interface ConnectionStatusProps {
    activity: ScreenConnectionStatus | null;
    activityError: string | null;
}

export interface LocationSectionProps {
    screen: Screen;
    googleMapsApiKey: string;
}

export interface ScreenSettingsFormProps {
    settings: ScreenSettings;
    onSave: (data: SettingsFormData) => Promise<void>;
    onReset: () => Promise<void>;
    isSaving: boolean;
    saveStatus: 'idle' | 'success' | 'error';
}
