// src/features/playlist/components/PlaylistForm.tsx
import React, { useState } from 'react';

// Mock react-hook-form functionality for preview
const useForm = (config) => {
  const [formData, setFormData] = useState(config.defaultValues || {});
  const [errors, setErrors] = useState({});

  const register = (name) => ({
    name,
    value: getNestedValue(formData, name) || (name.includes('Ids') ? '' : ''),
    onChange: (e) => {
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      // Convert comma-separated strings to arrays for screenIds and contentIds
      if (name === 'screenIds' || name === 'contentIds') {
        value = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }

      setFormData(prev => setNestedValue(prev, name, value));
    }
  });

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    register,
    handleSubmit,
    formState: { errors }
  };
};

// Helper functions for nested object manipulation
const getNestedValue = (obj, path) => {
  const value = path.split('.').reduce((current, key) => current?.[key], obj);
  // Convert arrays to comma-separated strings for display
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value;
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
};

// 1. Make PlaylistForm a NAMED export by adding the `export` keyword.
// This makes the core form reusable if you ever need it elsewhere (e.g., in an edit modal).
export const PlaylistForm = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: null,
    defaultValues: {
      name: initialData?.name || '',
      playlistData: {
        startTime: initialData?.playlistData?.startTime || new Date().toISOString().slice(0, 16),
        endTime: initialData?.playlistData?.endTime || new Date().toISOString().slice(0, 16),
        repeat: initialData?.playlistData?.repeat !== false,
        metadata: {
          priority: initialData?.playlistData?.metadata?.priority || 'normal',
          createdBy: initialData?.playlistData?.metadata?.createdBy || 'admin'
        }
      },
      screenIds: initialData?.screenIds || [],
      contentIds: initialData?.contentIds || []
    }
  });

  return (
      <div className="space-y-6 max-w-2xl mx-auto p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Playlist Name
          </label>
          <input
              type="text"
              {...register('name')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter playlist name"
          />
          {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
                type="datetime-local"
                {...register('playlistData.startTime')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
                type="datetime-local"
                {...register('playlistData.endTime')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                {...register('playlistData.repeat')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">Repeat Playlist</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
              {...register('playlistData.metadata.priority')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Screen IDs
          </label>
          <input
              type="text"
              {...register('screenIds')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 1,2,3"
          />
          <p className="mt-1 text-xs text-gray-500">Enter screen IDs separated by commas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content IDs
          </label>
          <input
              type="text"
              {...register('contentIds')}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 4,5,6"
          />
          <p className="mt-1 text-xs text-gray-500">Enter content IDs separated by commas</p>
        </div>

        <div className="flex justify-end pt-4">
          <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm"
          >
            Save Playlist
          </button>
        </div>
      </div>
  );
};


// 2. The demo component, which represents the full "Create" page, remains the DEFAULT export.
export default function PlaylistFormDemo() {
  const handleSubmit = async (data) => {
    // Transform the data to match backend expectations
    const transformedData = {
      ...data,
      playlistData: {
        ...data.playlistData,
        startTime: new Date(data.playlistData.startTime).toISOString(),
        endTime: new Date(data.playlistData.endTime).toISOString()
      }
    };

    console.log('Form submitted (transformed for backend):', transformedData);
    alert('Form submitted! Check console for transformed data that matches backend format.');
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Create New Playlist</h1>
          <div className="bg-white rounded-xl shadow-lg">
            {/* This still works because PlaylistForm is in the same file */}
            <PlaylistForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
  );
}