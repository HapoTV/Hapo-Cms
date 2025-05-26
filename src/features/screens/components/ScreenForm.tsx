import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { screenSchema } from '../types';

interface ScreenFormProps {
  screenId?: string;
  onSubmit: (data: any) => Promise<void>;
}

export const ScreenForm: React.FC<ScreenFormProps> = ({ screenId, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(screenSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Screen Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="WINDOWS">Windows</option>
          <option value="MAC">Mac</option>
          <option value="LINUX">Linux</option>
          <option value="ANDROID">Android</option>
          <option value="IOS">iOS</option>
          <option value="WEB">Web</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          {...register('location')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Orientation
        </label>
        <select
          {...register('orientation')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="LANDSCAPE">Landscape</option>
          <option value="PORTRAIT">Portrait</option>
        </select>
        {errors.orientation && (
          <p className="mt-1 text-sm text-red-600">{errors.orientation.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resolution
        </label>
        <select
          {...register('resolution')}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="1920x1080">1920x1080 (Full HD)</option>
          <option value="3840x2160">3840x2160 (4K)</option>
          <option value="1280x720">1280x720 (HD)</option>
        </select>
        {errors.resolution && (
          <p className="mt-1 text-sm text-red-600">{errors.resolution.message as string}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {screenId ? 'Save Changes' : 'Add Screen'}
        </button>
      </div>
    </form>
  );
};