import { format, parse, isValid } from 'date-fns';
import type { TimeSlot, Schedule } from '../types/schedule';

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};

export const formatTime = (time: string): string => {
  const parsedTime = parse(time, 'HH:mm', new Date());
  return format(parsedTime, 'h:mm a');
};

export const cleanString = (str: string): string => {
  return str.replace(/\\"/g, '"').replace(/^"|"$/g, '');
};

export const checkTimeSlotOverlap = (slots: TimeSlot[]): boolean => {
  const sortedSlots = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const currentSlot = sortedSlots[i];
    const nextSlot = sortedSlots[i + 1];
    
    if (currentSlot.endTime > nextSlot.startTime) {
      return true;
    }
  }
  
  return false;
};

export const validateSchedule = (schedule: Schedule): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate dates
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);

  if (!isValid(startDate)) {
    errors.push('Invalid start date');
  }

  if (!isValid(endDate)) {
    errors.push('Invalid end date');
  }

  if (startDate > endDate) {
    errors.push('Start date must be before end date');
  }

  // Validate time slots
  if (schedule.timeSlots.length === 0) {
    errors.push('At least one time slot is required');
  }

  if (checkTimeSlotOverlap(schedule.timeSlots)) {
    errors.push('Time slots cannot overlap');
  }

  schedule.timeSlots.forEach((slot, index) => {
    if (slot.startTime >= slot.endTime) {
      errors.push(`Time slot ${index + 1}: Start time must be before end time`);
    }
  });

  // Validate recurrence
  if (schedule.recurrence.isRecurring) {
    if (schedule.recurrence.type === 'WEEKLY' && (!schedule.recurrence.daysOfWeek || schedule.recurrence.daysOfWeek.length === 0)) {
      errors.push('Weekly recurrence requires at least one day of the week');
    }

    if (schedule.recurrence.type === 'MONTHLY' && (!schedule.recurrence.daysOfMonth || schedule.recurrence.daysOfMonth.length === 0)) {
      errors.push('Monthly recurrence requires at least one day of the month');
    }
  }

  // Validate assignments
  if (schedule.screenIds.length === 0 && schedule.screenGroupIds.length === 0) {
    errors.push('At least one screen or screen group must be assigned');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = parse(endTime, 'HH:mm', new Date());
  return (end.getTime() - start.getTime()) / 1000 / 60; // Duration in minutes
};