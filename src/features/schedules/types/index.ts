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
    id?: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    recurrencePattern: RecurrencePattern;
    timeSlots: TimeSlot[];
    weeklySchedule?: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
    metadata: {
        targetAudience?: string;
        region?: string;
        [key: string]: any;
    };
    screenIds: number[];
    screenGroupIds: number[];
    playlistIds: number[];
}