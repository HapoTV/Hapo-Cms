import { z } from 'zod';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  playlistId: number;
  duration: number;
  isEnabled: boolean;
}

export interface RecurrencePattern {
  isRecurring: boolean;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  daysOfWeek?: DayOfWeek[];
  intervalDays?: number;
  repeatCount?: number;
  daysOfMonth?: number[];
}

export interface BasicInfo {
  name: string;
  description: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  startDate: string;
  endDate: string;
}

export interface Schedule extends BasicInfo {
  recurrence: RecurrencePattern;
  timeSlots: TimeSlot[];
  screenIds: string[];
  screenGroupIds: string[];
  playlistIds: number[];
  metadata: Record<string, any>;
  isValid: boolean;
}

// Zod Schemas for validation
export const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  playlistId: z.number().positive(),
  duration: z.number().min(0),
  isEnabled: z.boolean()
});

export const recurrencePatternSchema = z.object({
  isRecurring: z.boolean(),
  type: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']),
  daysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(),
  intervalDays: z.number().positive().optional(),
  repeatCount: z.number().positive().optional(),
  daysOfMonth: z.array(z.number().min(1).max(31)).optional()
});

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'EMERGENCY']),
  startDate: z.string(),
  endDate: z.string()
});

export const scheduleSchema = basicInfoSchema.extend({
  recurrence: recurrencePatternSchema,
  timeSlots: z.array(timeSlotSchema),
  screenIds: z.array(z.string()),
  screenGroupIds: z.array(z.string()),
  playlistIds: z.array(z.number()),
  metadata: z.record(z.any()),
  isValid: z.boolean()
});