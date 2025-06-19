import { z } from 'zod';

export const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  locations: z.array(z.string()).min(1, 'At least one location is required'),
  status: z.enum(['draft', 'scheduled', 'active', 'completed', 'paused']),
  contentIds: z.array(z.string()),
});

export type Campaign = z.infer<typeof campaignSchema>;