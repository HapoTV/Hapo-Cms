import { z } from 'zod';

export const screenSettingsSchema = z.object({
  display: z.object({
    brightness: z.number().min(0).max(100),
    contrast: z.number().min(0).max(100),
  }),
  content: z.object({
    autoPlay: z.boolean(),
    loop: z.boolean(),
    transitionDuration: z.number().min(0),
  }),
  network: z.object({
    updateInterval: z.number().min(1),
    offlineMode: z.boolean(),
  }),
  maintenance: z.object({
    restartTime: z.string(),
    autoUpdate: z.boolean(),
  }),
});

export type ScreenSettings = z.infer<typeof screenSettingsSchema>;

export const defaultScreenSettings: ScreenSettings = {
  display: {
    brightness: 100,
    contrast: 50,
  },
  content: {
    autoPlay: true,
    loop: true,
    transitionDuration: 1,
  },
  network: {
    updateInterval: 5,
    offlineMode: false,
  },
  maintenance: {
    restartTime: '03:00',
    autoUpdate: true,
  },
};