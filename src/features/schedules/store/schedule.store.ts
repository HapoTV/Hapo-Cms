import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {scheduleService} from '../services/schedule.service';
import type {Schedule} from '../types';

interface ScheduleState {
    schedules: Schedule[];
    selectedSchedule: Schedule | null;
    isLoading: boolean;
    error: string | null;
    fetchSchedules: () => Promise<void>;
    createSchedule: (schedule: Omit<Schedule, 'id'>) => Promise<void>;
    updateSchedule: (id: string, schedule: Partial<Schedule>) => Promise<void>;
    deleteSchedule: (id: string) => Promise<void>;
    setSelectedSchedule: (schedule: Schedule | null) => void;
}

export const useScheduleStore = create<ScheduleState>()(
    devtools(
        (set) => ({
            schedules: [],
            selectedSchedule: null,
            isLoading: false,
            error: null,

            fetchSchedules: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const schedules = await scheduleService.getAllSchedules();
                    set({ schedules, isLoading: false });
                } catch (error) {
                    set({ error: 'Failed to fetch schedules', isLoading: false });
                    console.error("Error fetching schedules:", error);
                }
            },

            createSchedule: async (schedule) => {
                try {
                    set({ isLoading: true, error: null });
                    const newSchedule = await scheduleService.createSchedule(schedule);
                    set(state => ({
                        schedules: [...state.schedules, newSchedule],
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: 'Failed to create schedule', isLoading: false });
                    throw error;
                }
            },

            updateSchedule: async (id, schedule) => {
                try {
                    set({ isLoading: true, error: null });
                    const updatedSchedule = await scheduleService.updateSchedule(id, schedule);
                    set(state => ({
                        schedules: state.schedules.map(s => (s.id && s.id === id) ? updatedSchedule : s),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: 'Failed to update schedule', isLoading: false });
                    throw error;
                }
            },

            deleteSchedule: async (id) => {
                try {
                    set({ isLoading: true, error: null });
                    await scheduleService.deleteSchedule(id);
                    set(state => ({
                        schedules: state.schedules.filter(s => s.id !== id),
                        isLoading: false
                    }));
                } catch (error) {
                    set({ error: 'Failed to delete schedule', isLoading: false });
                    throw error;
                }
            },

            setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule })
        }),
        {
            name: 'schedule-store'
        }
    )
);
