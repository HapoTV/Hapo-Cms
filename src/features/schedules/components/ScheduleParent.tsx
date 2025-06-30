import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {ScheduleCalendar} from './ScheduleCalendar';
import {ScheduleManager} from './ScheduleManager';
import {useScheduleStore} from '../store/schedule.store';
import type {Schedule} from '../types';

const ScheduleParent: React.FC = () => {
  const { schedules, fetchSchedules, createSchedule, updateSchedule } = useScheduleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Partial<Schedule> | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSelectEvent = (event: { resource: Schedule }) => {
    setSelectedSchedule(event.resource);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSchedule({
      startDate: slotInfo.start.toISOString(),
      endDate: slotInfo.end.toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveSchedule = (schedule: Partial<Schedule>) => {
    if (schedule.id) {
      updateSchedule(schedule.id, schedule);
    } else {
      createSchedule(schedule as Omit<Schedule, 'id'>);
    }
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
        <button
          onClick={() => {
            setSelectedSchedule(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Schedule
        </button>
      </div>

      <ScheduleCalendar
        schedules={schedules}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      <ScheduleManager
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchedule(null);
        }}
        onSave={handleSaveSchedule}
        initialData={selectedSchedule || undefined}
      />
    </div>
  );
};

export default ScheduleParent;
