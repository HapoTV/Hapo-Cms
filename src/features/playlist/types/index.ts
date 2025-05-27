import { z } from 'zod';

export const playlistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  playlistData: z.object({
    startTime: z.string(),
    endTime: z.string(),
    repeat: z.boolean(),
    metadata: z.object({
      priority: z.enum(['low', 'normal', 'high', 'emergency']),
      createdBy: z.string()
    })
  }),
  screenIds: z.array(z.number()),
  contentIds: z.array(z.number())
});

export type Playlist = z.infer<typeof playlistSchema>;