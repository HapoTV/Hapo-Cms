import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, AlertCircle } from 'lucide-react';

const systemSettingsSchema = z.object({
  retentionPeriod: z.number().min(1, 'Retention period must be at least 1 day'),
  defaultTags: z.array(z.string()),
  analyticsEnabled: z.boolean(),
});

type SystemSettings = z.infer<typeof systemSettingsSchema>;

const defaultSettings: SystemSettings = {
  retentionPeriod: 90,
  defaultTags: ['Promotional', 'Event', 'Product'],
  analyticsEnabled: true,
};

export const Settings = () => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<SystemSettings>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: defaultSettings,
  });

  const onSubmit = async (data: SystemSettings) => {
    try {
      // Save settings
      console.log('Saving settings:', data);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">System Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Content Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Retention Period (days)
              </label>
              <input
                type="number"
                {...register('retentionPeriod', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.retentionPeriod && (
                <p className="mt-1 text-sm text-red-600">{errors.retentionPeriod.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Analytics
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('analyticsEnabled')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Enable analytics tracking</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {isDirty && (
          <div className="fixed bottom-4 right-4 flex items-center gap-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center text-yellow-700 bg-yellow-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              You have unsaved changes
            </div>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};