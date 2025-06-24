// src/features/screens/components/ScreenSettings.tsx
import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {ScreenSettings as ScreenSettingsType} from '../types';
import {screenSettingsSchema} from '../types';

interface ScreenSettingsProps {
  screenId: string;
  settings: ScreenSettingsType;
  onSave: (settings: ScreenSettingsType) => Promise<void>;
}

export const ScreenSettings: React.FC<ScreenSettingsProps> = ({
  screenId,
  settings,
  onSave,
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(screenSettingsSchema),
    defaultValues: settings
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brightness
            </label>
            <input
              type="range"
              min="0"
              max="100"
              {...register('display.brightness')}
              className="w-full"
            />
            {errors.display?.brightness && (
              <p className="mt-1 text-sm text-red-600">{errors.display.brightness.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contrast
            </label>
            <input
              type="range"
              min="0"
              max="100"
              {...register('display.contrast')}
              className="w-full"
            />
            {errors.display?.contrast && (
              <p className="mt-1 text-sm text-red-600">{errors.display.contrast.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Content Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('content.autoPlay')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-play content</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('content.loop')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Loop content</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transition Duration (seconds)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              {...register('content.transitionDuration')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.content?.transitionDuration && (
              <p className="mt-1 text-sm text-red-600">{errors.content.transitionDuration.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Network Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content Update Interval (minutes)
            </label>
            <input
              type="number"
              min="1"
              {...register('network.updateInterval')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.network?.updateInterval && (
              <p className="mt-1 text-sm text-red-600">{errors.network.updateInterval.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('network.offlineMode')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable offline mode</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Maintenance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Restart Time
            </label>
            <input
              type="time"
              {...register('maintenance.restartTime')}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.maintenance?.restartTime && (
              <p className="mt-1 text-sm text-red-600">{errors.maintenance.restartTime.message}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('maintenance.autoUpdate')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable automatic updates</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};