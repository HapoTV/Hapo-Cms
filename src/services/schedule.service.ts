import apiService from './api.service';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  playlistId: number;
  duration: number;
  isEnabled: boolean;
}

export interface RecurrencePattern {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  daysOfWeek?: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
  intervalDays?: number;
  repeatCount?: number;
  daysOfMonth?: number[];
}

export interface Schedule {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  timeSlots: TimeSlot[];
  weeklySchedule?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  metadata?: any;
  screenIds: number[];
  screenGroupIds: number[];
  playlistIds: number[];
}

export const scheduleService = {
  createSchedule: async (schedule: Schedule): Promise<Schedule> => {
    return apiService.post<Schedule>('/api/schedules', schedule);
  },

  getAllSchedules: async (): Promise<Schedule[]> => {
    return apiService.get<Schedule[]>('/api/schedules');
  },

  getScheduleById: async (id: number): Promise<Schedule> => {
    return apiService.get<Schedule>(`/api/schedules/${id}`);
  },

  updateSchedule: async (id: number, schedule: Schedule): Promise<Schedule> => {
    return apiService.put<Schedule>(`/api/schedules/${id}`, schedule);
  },

  deleteSchedule: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/schedules/${id}`);
  },

  getActiveSchedulesForScreen: async (screenId: number): Promise<Schedule[]> => {
    return apiService.get<Schedule[]>(`/api/schedules/screen/${screenId}/active`);
  },

  getActiveSchedulesForGroup: async (groupId: number): Promise<Schedule[]> => {
    return apiService.get<Schedule[]>(`/api/schedules/group/${groupId}/active`);
  },

  assignScheduleToScreen: async (scheduleId: number, screenId: number): Promise<Schedule> => {
    return apiService.post<Schedule>(`/api/schedules/${scheduleId}/screen/${screenId}`);
  },

  removeScheduleFromScreen: async (scheduleId: number, screenId: number): Promise<Schedule> => {
    return apiService.delete<Schedule>(`/api/schedules/${scheduleId}/screen/${screenId}`);
  },

  assignScheduleToGroup: async (scheduleId: number, groupId: number): Promise<Schedule> => {
    return apiService.post<Schedule>(`/api/schedules/${scheduleId}/group/${groupId}`);
  },

  removeScheduleFromGroup: async (scheduleId: number, groupId: number): Promise<Schedule> => {
    return apiService.delete<Schedule>(`/api/schedules/${scheduleId}/group/${groupId}`);
  }
};

export default scheduleService;