// src/features/screens/types/settings.ts
import {z} from 'zod';

// This schema combines the backend's required structure with our extra frontend settings.
export const screenSettingsSchema = z.object({
  // Backend-required top-level fields
  loop: z.boolean(),
  cacheMedia: z.boolean(),
  fallbackToCache: z.boolean(),

  // The flexible metadata container
    settingsMetadata: z.object({
    // Backend-required metadata fields
    brightness: z.coerce.number().min(0).max(100),
    volume: z.coerce.number().min(0).max(100),
    powerSaving: z.boolean(),

        // Our "extra" frontend-specific settings, now stored inside settingsMetadata
    contrast: z.coerce.number().min(0).max(100),
    autoPlay: z.boolean(),
    transitionDuration: z.coerce.number().min(0),
    updateInterval: z.coerce.number().min(1),
    offlineMode: z.boolean(),
    restartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
    autoUpdate: z.boolean(),
  }),
});

export type ScreenSettings = z.infer<typeof screenSettingsSchema>;

// Default values updated to match the new hybrid structure
export const defaultScreenSettings: ScreenSettings = {
  // Top-level defaults
  loop: true,
  cacheMedia: true,
  fallbackToCache: true,

  // Metadata defaults
    settingsMetadata: {
    brightness: 90,
    volume: 0,
    powerSaving: true,
    contrast: 50,
    autoPlay: true,
    transitionDuration: 1,
    updateInterval: 5,
    offlineMode: false,
    restartTime: '03:00',
    autoUpdate: true,
  },
};
