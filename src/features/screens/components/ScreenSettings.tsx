// src/features/screens/components/ScreenSettings.tsx

import React from 'react';
import {useFormContext} from 'react-hook-form';

/**
 * A "form partial" component for editing screen settings.
 * It does NOT have its own form state. It must be used inside a <FormProvider>
 * wrapper, and it registers its fields to the parent form's state.
 */
export const ScreenSettings: React.FC = () => {
    // 1. We get form methods from the parent context, NOT from a new `useForm` call.
    const {register, formState: {errors}} = useFormContext();

    // 2. Define the base path for all fields in this component. This ensures they
    // are correctly nested under `screenSettingsDTO` in the main form's data.
    const basePath = 'screenSettingsDTO';

    // 3. Helper to safely access nested errors from the parent form's `errors` object.
    const settingsErrors = (errors[basePath] as any) || {};

    // 4. The component returns a <div> or Fragment, NOT a <form> tag.
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Screen Settings</h2>

            {/* Playback Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Playback Settings</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(`${basePath}.loop`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">Loop content playlist</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(`${basePath}.cacheMedia`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">Cache media locally</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(`${basePath}.fallbackToCache`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">Fallback to cache on network failure</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...register(`${basePath}.metadata.autoPlay`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">Auto-play content</span>
                    </label>
                </div>
            </div>

            {/* Display Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brightness
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            {...register(`${basePath}.metadata.brightness`)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        {settingsErrors.metadata?.brightness && (
                            <p className="mt-1 text-sm text-red-600">{settingsErrors.metadata.brightness.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contrast
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            {...register(`${basePath}.metadata.contrast`)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        {settingsErrors.metadata?.contrast && (
                            <p className="mt-1 text-sm text-red-600">{settingsErrors.metadata.contrast.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transition Duration (seconds)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.5"
                            {...register(`${basePath}.metadata.transitionDuration`)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {settingsErrors.metadata?.transitionDuration && (
                            <p className="mt-1 text-sm text-red-600">{settingsErrors.metadata.transitionDuration.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Device & Network Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Device & Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Update Interval (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            {...register(`${basePath}.metadata.updateInterval`)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {settingsErrors.metadata?.updateInterval && (
                            <p className="mt-1 text-sm text-red-600">{settingsErrors.metadata.updateInterval.message}</p>
                        )}
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                {...register(`${basePath}.metadata.offlineMode`)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700">Enable offline mode</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                {...register(`${basePath}.metadata.powerSaving`)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700">Enable power saving mode</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Maintenance Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Daily Restart Time
                        </label>
                        <input
                            type="time"
                            {...register(`${basePath}.metadata.restartTime`)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {settingsErrors.metadata?.restartTime && (
                            <p className="mt-1 text-sm text-red-600">{settingsErrors.metadata.restartTime.message}</p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                {...register(`${basePath}.metadata.autoUpdate`)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-gray-700">Enable automatic updates</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};