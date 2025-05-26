import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Eye,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Layers,
  Monitor,
  PlaySquare,
  Info
} from 'lucide-react';

interface TimeSlot {
  startTime: string;
  endTime: string;
  playlistId: string;
  enabled: boolean;
}

interface Schedule {
  name: string;
  description: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  startDate: string;
  endDate: string;
  recurrence: {
    type: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    weekDays?: string[];
    monthDays?: number[];
  };
  timeSlots: TimeSlot[];
  screenIds: string[];
  screenGroupIds: string[];
  playlistIds: string[];
  metadata: Record<string, any>;
  isValid: boolean;
}

interface ScheduleDetailsProps {
  schedule: Schedule;
  onSave: (schedule: Schedule) => void;
}

const PriorityBadge: React.FC<{ priority: Schedule['priority'] }> = ({ priority }) => {
  const colors = {
    LOW: 'bg-gray-100 text-gray-800',
    NORMAL: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-yellow-100 text-yellow-800',
    EMERGENCY: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({ schedule, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<Schedule>(schedule);

  const handleInputChange = (field: keyof Schedule, value: any) => {
    setEditedSchedule(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSlotChange = (index: number, field: keyof TimeSlot, value: any) => {
    const newTimeSlots = [...editedSchedule.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setEditedSchedule(prev => ({ ...prev, timeSlots: newTimeSlots }));
  };

  const handleSave = () => {
    onSave(editedSchedule);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ViewMode = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{schedule.name}</h2>
          <p className="mt-1 text-gray-500">{schedule.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <PriorityBadge priority={schedule.priority} />
          <div className="flex items-center gap-2">
            {schedule.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            <span className={schedule.isValid ? 'text-green-700' : 'text-yellow-700'}>
              {schedule.isValid ? 'Valid' : 'Invalid'}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Date Range</h3>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="mt-1 font-medium">{formatDate(schedule.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="mt-1 font-medium">{formatDate(schedule.endDate)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Recurrence</p>
          <p className="mt-1 font-medium">
            {schedule.recurrence.type !== 'NONE' && (
              <>
                Repeats {schedule.recurrence.type.toLowerCase()}
                {schedule.recurrence.type === 'WEEKLY' && schedule.recurrence.weekDays && (
                  <span className="ml-2">
                    on {schedule.recurrence.weekDays.join(', ')}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Time Slots</h3>
        </div>
        <div className="space-y-4">
          {schedule.timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                slot.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">{formatTime(slot.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium">{formatTime(slot.endTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Playlist</p>
                    <p className="font-medium">{slot.playlistId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${slot.enabled ? 'text-green-600' : 'text-red-600'}`}>
                      {slot.enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Assignments</h3>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Screens</p>
            </div>
            <ul className="space-y-1">
              {schedule.screenIds.map(id => (
                <li key={id} className="text-sm font-medium">{id}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Screen Groups</p>
            </div>
            <ul className="space-y-1">
              {schedule.screenGroupIds.map(id => (
                <li key={id} className="text-sm font-medium">{id}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlaySquare className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-500">Playlists</p>
            </div>
            <ul className="space-y-1">
              {schedule.playlistIds.map(id => (
                <li key={id} className="text-sm font-medium">{id}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(schedule.metadata).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">{key}</p>
              <p className="mt-1 font-medium">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EditMode = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
      {/* Basic Info Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedSchedule.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedSchedule.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={editedSchedule.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Range Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Date Range</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={editedSchedule.startDate.split('T')[0]}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={editedSchedule.endDate.split('T')[0]}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
        <div className="space-y-4">
          {editedSchedule.timeSlots.map((slot, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) => handleTimeSlotChange(index, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Enabled</label>
                </div>
                <input
                  type="text"
                  value={slot.playlistId}
                  onChange={(e) => handleTimeSlotChange(index, 'playlistId', e.target.value)}
                  placeholder="Playlist ID"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {isEditing ? <EditMode /> : <ViewMode />}
    </div>
  );
};

export default ScheduleDetails;