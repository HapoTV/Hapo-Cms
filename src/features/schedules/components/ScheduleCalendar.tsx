import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Schedule } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface ScheduleCalendarProps {
    schedules: Schedule[];
    onSelectEvent: (event: any) => void;
    onSelectSlot: (slotInfo: any) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
                                                                      schedules,
                                                                      onSelectEvent,
                                                                      onSelectSlot,
                                                                  }) => {
    const events = useMemo(() => {
        return schedules.map(schedule => ({
            id: schedule.id,
            title: schedule.name,
            start: new Date(schedule.startDate),
            end: new Date(schedule.endDate),
            allDay: false,
            resource: schedule,
        }));
    }, [schedules]);

    const eventStyleGetter = (event: any) => {
        const priority = event.resource.priority;
        const style: any = {
            borderRadius: '4px',
            opacity: 0.8,
            border: '0',
            display: 'block',
        };

        switch (priority) {
            case 'HIGH':
                style.backgroundColor = '#EF4444';
                break;
            case 'NORMAL':
                style.backgroundColor = '#3B82F6';
                break;
            case 'LOW':
                style.backgroundColor = '#10B981';
                break;
            case 'EMERGENCY':
                style.backgroundColor = '#7C3AED';
                break;
            default:
                style.backgroundColor = '#6B7280';
        }

        return { style };
    };

    return (
        <div className="h-[calc(100vh-12rem)]">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                defaultView={Views.WEEK}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                step={30}
                timeslots={2}
            />
        </div>
    );
};