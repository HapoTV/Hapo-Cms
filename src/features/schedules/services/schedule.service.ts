import { api } from '../../../services/api';
import type { Schedule } from '../types';

export const scheduleService = {
    getAllSchedules: async (): Promise<Schedule[]> => {
        return api.get('/schedules');
    },

    getScheduleById: async (id: string): Promise<Schedule> => {
        return api.get(`/schedules/${id}`);
    },

    createSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
        return api.post('/schedules', schedule);
    },

    updateSchedule: async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
        return api.put(`/schedules/${id}`, schedule);
    },

    deleteSchedule: async (id: string): Promise<void> => {
        return api.delete(`/schedules/${id}`);
    }
};