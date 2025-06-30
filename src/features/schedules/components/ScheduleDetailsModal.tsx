import React, {useEffect, useState} from 'react';
import {Plus, Trash, X} from 'lucide-react';
import type {Schedule, TimeSlot} from '../types';

interface ScheduleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Partial<Schedule>) => void;
  initialData?: Partial<Schedule>;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Schedule>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isRecurring: false,
    recurrencePattern: {
      type: 'DAILY',
      daysOfWeek: [],
      intervalDays: 1,
      repeatCount: 1,
      daysOfMonth: []
    },
    timeSlots: [{
      startTime: '09:00:00',
      endTime: '17:00:00',
      playlistId: 0,
      duration: 480,
      isEnabled: true
    }],
    priority: 'NORMAL',
    metadata: {
      targetAudience: '',
      region: ''
    },
    screenIds: [],
    screenGroupIds: [],
    playlistIds: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        recurrencePattern: initialData.recurrencePattern || formData.recurrencePattern,
        timeSlots: initialData.timeSlots || formData.timeSlots,
        metadata: initialData.metadata || formData.metadata
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  type RecurrenceChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | {
    target: { name: string; value: string | number }
  };

  const handleRecurrenceChange = (e: RecurrenceChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      recurrencePattern: {
        ...(prev.recurrencePattern || {}),
        [name]: value
      }
    }));
  };

  const handleDaysOfWeekChange = (day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY') => {
    setFormData(prev => {
      const currentDays = prev.recurrencePattern?.daysOfWeek || [];
      const newDays = currentDays.includes(day) 
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];

      return {
        ...prev,
        recurrencePattern: {
          ...(prev.recurrencePattern || {}),
          daysOfWeek: newDays
        }
      };
    });
  };

  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: string | number | boolean) => {
    setFormData(prev => {
      const newTimeSlots = [...(prev.timeSlots || [])];
      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [field]: value
      };
      return {
        ...prev,
        timeSlots: newTimeSlots
      };
    });
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [
        ...(prev.timeSlots || []),
        {
          startTime: '09:00:00',
          endTime: '17:00:00',
          playlistId: 0,
          duration: 480,
          isEnabled: true
        }
      ]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: (prev.timeSlots || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority || 'NORMAL'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate && !isNaN(new Date(formData.startDate).getTime()) ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    startDate: date.toISOString()
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate && !isNaN(new Date(formData.endDate).getTime()) ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    endDate: date.toISOString()
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                Recurring Schedule
              </label>
            </div>

            {formData.isRecurring && (
              <div className="border border-gray-200 rounded-md p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurrence Type
                  </label>
                  <select
                    name="type"
                    value={formData.recurrencePattern?.type || 'DAILY'}
                    onChange={handleRecurrenceChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>

                {formData.recurrencePattern?.type === 'WEEKLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDaysOfWeekChange(day)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            formData.recurrencePattern?.daysOfWeek?.includes(day as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.recurrencePattern?.type === 'MONTHLY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days of Month
                    </label>
                    <input
                      type="text"
                      name="daysOfMonth"
                      value={formData.recurrencePattern?.daysOfMonth?.join(', ') || ''}
                      onChange={(e) => {
                        const daysArray = e.target.value
                          .split(',')
                          .map(day => parseInt(day.trim()))
                          .filter(day => !isNaN(day) && day > 0 && day <= 31);

                        setFormData(prev => ({
                          ...prev,
                          recurrencePattern: {
                            ...prev.recurrencePattern!,
                            daysOfMonth: daysArray
                          }
                        }));
                      }}
                      placeholder="e.g. 1, 15, 30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interval Days
                    </label>
                    <input
                      type="number"
                      name="intervalDays"
                      value={formData.recurrencePattern?.intervalDays || 1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          handleRecurrenceChange({
                            target: { name: 'intervalDays', value }
                          });
                        }
                      }}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repeat Count
                    </label>
                    <input
                      type="number"
                      name="repeatCount"
                      value={formData.recurrencePattern?.repeatCount || 1}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          handleRecurrenceChange({
                            target: { name: 'repeatCount', value }
                          });
                        }
                      }}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Time Slots
              </label>
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center text-sm text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Time Slot
              </button>
            </div>

            <div className="space-y-3">
              {formData.timeSlots?.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime ? slot.startTime.slice(0, 5) : '00:00'}
                        onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value + ':00')}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <input
                        type="time"
                        value={slot.endTime ? slot.endTime.slice(0, 5) : '00:00'}
                        onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value + ':00')}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Playlist ID</label>
                      <input
                        type="number"
                        value={slot.playlistId}
                        onChange={(e) => handleTimeSlotChange(index, 'playlistId', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="text-red-500 hover:text-red-600"
                    disabled={formData.timeSlots?.length === 1}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen IDs (comma separated)
              </label>
              <input
                type="text"
                value={formData.screenIds?.join(', ') || ''}
                onChange={(e) => {
                  const idsArray = e.target.value
                    .split(',')
                    .map(id => parseInt(id.trim()))
                    .filter(id => !isNaN(id));

                  setFormData(prev => ({
                    ...prev,
                    screenIds: idsArray
                  }));
                }}
                placeholder="e.g. 1, 2, 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen Group IDs (comma separated)
              </label>
              <input
                type="text"
                value={formData.screenGroupIds?.join(', ') || ''}
                onChange={(e) => {
                  const idsArray = e.target.value
                    .split(',')
                    .map(id => parseInt(id.trim()))
                    .filter(id => !isNaN(id));

                  setFormData(prev => ({
                    ...prev,
                    screenGroupIds: idsArray
                  }));
                }}
                placeholder="e.g. 1, 2, 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.metadata?.targetAudience || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    metadata: {
                      ...(prev.metadata || {}),
                      targetAudience: e.target.value
                    }
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                value={formData.metadata?.region || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    metadata: {
                      ...(prev.metadata || {}),
                      region: e.target.value
                    }
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {initialData?.id ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
