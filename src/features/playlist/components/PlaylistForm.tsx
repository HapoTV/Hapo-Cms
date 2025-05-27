import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { playlistSchema } from '../types';
import type { Playlist } from '../types';

interface PlaylistFormProps {
  onSubmit: (data: Playlist) => Promise<void>;
  initialData?: Partial<Playlist>;
}

export const PlaylistForm: React.FC<PlaylistFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Playlist>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: initialData?.name || '',
      playlistData: {
        startTime: initialData?.playlistData?.startTime || new Date().toISOString(),
        endTime: initialData?.playlistData?.endTime || new Date().toISOString(),
        repeat: initialData?.playlistData?.repeat || true,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Playlist Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            {...register('playlistData.startTime')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            {...register('playlistData.endTime')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('playlistData.repeat')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Repeat Playlist</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          {...register('playlistData.metadata.priority')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Playlist
        </button>
      </div>
    </form>
  );
};