/*
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2, Clock, PlaySquare } from 'lucide-react';
import type { TimeSlot } from '../types/schedule';
import { calculateDuration } from '../utils/scheduleUtils';

interface TimeSlotEditorProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  onValidate: (slots: TimeSlot[]) => boolean;
}

const TimeSlotEditor: React.FC<TimeSlotEditorProps> = ({ value, onChange, onValidate }) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeSlots'
  });

  const handleAddSlot = () => {
    append({
      startTime: '09:00',
      endTime: '17:00',
      playlistId: 0,
      duration: 480,
      isEnabled: true
    });
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const slots = [...fields];
    slots[index][field] = value;
    
    if (slots[index].startTime && slots[index].endTime) {
      slots[index].duration = calculateDuration(slots[index].startTime, slots[index].endTime);
    }
    
    onChange(slots as TimeSlot[]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Time Slots</h3>
        <button
          type="button"
          onClick={handleAddSlot}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Slot
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={field.startTime}
                  onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  value={field.endTime}
                  onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <PlaySquare className="w-4 h-4 inline mr-1" />
                  Playlist ID
                </label>
                <input
                  type="number"
                  value={field.playlistId}
                  onChange={(e) => {
                    const slots = [...fields];
                    slots[index].playlistId = parseInt(e.target.value);
                    onChange(slots as TimeSlot[]);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  checked={field.isEnabled}
                  onChange={(e) => {
                    const slots = [...fields];
                    slots[index].isEnabled = e.target.checked;
                    onChange(slots as TimeSlot[]);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Enabled</label>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errors.timeSlots?.[index] && (
              <p className="mt-2 text-sm text-red-600">
                {errors.timeSlots[index].message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotEditor;*/
