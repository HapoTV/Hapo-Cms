import { z } from 'zod';

export const screenSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  location: z.string().min(1, 'Location is required'),
  orientation: z.enum(['LANDSCAPE', 'PORTRAIT']),
  resolution: z.string().min(1, 'Resolution is required'),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']),
  metadata: z.record(z.any()).optional(),
});

export type Screen = z.infer<typeof screenSchema>;