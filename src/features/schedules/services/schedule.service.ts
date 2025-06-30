import {apiService} from '../../../services/api.service.ts';
import type {Schedule} from '../types';

export const scheduleService = {
    getAllSchedules: async (): Promise<Schedule[]> => {
        return apiService.get('/schedules');
    },

    getScheduleById: async (id: string): Promise<Schedule> => {
        return apiService.get(`/schedules/${id}`);
    },

    createSchedule: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
        return apiService.post('/schedules', schedule);
    },

    updateSchedule: async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
        return apiService.put(`/schedules/${id}`, schedule);
    },

    deleteSchedule: async (id: string): Promise<void> => {
        return apiService.delete(`/schedules/${id}`);
    }
};