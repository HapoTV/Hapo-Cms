// src/features/screens/components/ScreenSettingsForm.tsx

import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle, Loader2, RotateCcw, Save, Settings, X} from 'lucide-react';
import {
    type ScreenSettingsFormProps,
    type SettingsFormData,
    settingsFormSchema,
    SUPPORTED_REFRESH_RATES,
    SUPPORTED_RESOLUTIONS
} from '../../types/screen-details.types';

export const ScreenSettingsForm: React.FC<ScreenSettingsFormProps> = ({
                                                                          settings,
                                                                          onSave,
                                                                          onReset,
                                                                          isSaving,
                                                                          saveStatus
                                                                      }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors, isDirty}
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: settings,
    });

    // Watch brightness and volume for a real-time display
    const brightness = watch('settingsMetadata.brightness');
    const volume = watch('settingsMetadata.volume');

    // Reset form when settings change
    useEffect(() => {
        reset(settings);
    }, [settings, reset]);

    const onSubmit = async (data: SettingsFormData) => {
        try {
            await onSave(data);
        } catch (error) {
            // Error is handled by the hook
            console.log(error);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            try {
                await onReset();
            } catch (error) {
                // Error is handled by the hook
                console.log(error);
            }
        }
    };

    return (
        <div className="w-full pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Playback Settings */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5"/>
                        Playback Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('loop')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Loop Content</span>
                                <p className="text-xs text-gray-500">Continuously repeat playlist</p>
                            </div>
                        </label>
                        <label
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('cacheMedia')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Cache Media</span>
                                <p className="text-xs text-gray-500">Store media locally</p>
                            </div>
                        </label>
                        <label
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('fallbackToCache')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Fallback to Cache</span>
                                <p className="text-xs text-gray-500">Use cache when offline</p>
                            </div>
                        </label>
                        <label
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('settingsMetadata.autoPlay')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-900">Auto-play</span>
                                <p className="text-xs text-gray-500">Start content automatically</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                    <h3 className="text-lg font-medium text-purple-900 mb-4">Display Settings</h3>

                    {/* Sliders Row */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Brightness: <span className="text-purple-600 font-semibold">{brightness}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                {...register('settingsMetadata.brightness')}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0%</span>
                                <span>100%</span>
                            </div>
                            {errors.settingsMetadata?.brightness && (
                                <p className="mt-1 text-sm text-red-600">{errors.settingsMetadata.brightness.message}</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Volume: <span className="text-purple-600 font-semibold">{volume}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                {...register('settingsMetadata.volume')}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Mute</span>
                                <span>Max</span>
                            </div>
                            {errors.settingsMetadata?.volume && (
                                <p className="mt-1 text-sm text-red-600">{errors.settingsMetadata.volume.message}</p>
                            )}
                        </div>

                    </div>

                    {/* Dropdowns and Inputs Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resolution
                            </label>
                            <select
                                {...register('settingsMetadata.resolution')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                {SUPPORTED_RESOLUTIONS.map(res => (
                                    <option key={res.value} value={res.value}>
                                        {res.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Refresh Rate
                            </label>
                            <select
                                {...register('settingsMetadata.refreshRate')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                {SUPPORTED_REFRESH_RATES.map(rate => (
                                    <option key={rate.value} value={rate.value}>
                                        {rate.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-purple-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transition Duration
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    {...register('settingsMetadata.transitionDuration')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-500">sec</span>
                            </div>
                            {errors.settingsMetadata?.transitionDuration && (
                                <p className="mt-1 text-sm text-red-600">{errors.settingsMetadata.transitionDuration.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Device & Network Settings */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                    <h3 className="text-lg font-medium text-green-900 mb-4">Device & Network</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Update Interval
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    {...register('settingsMetadata.updateInterval')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-500">min</span>
                            </div>
                            {errors.settingsMetadata?.updateInterval && (
                                <p className="mt-1 text-sm text-red-600">{errors.settingsMetadata.updateInterval.message}</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-green-100 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('settingsMetadata.offlineMode')}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Offline Mode</span>
                                    <p className="text-xs text-gray-500">Work without internet</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('settingsMetadata.powerSaving')}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Power Saving</span>
                                    <p className="text-xs text-gray-500">Reduce energy consumption</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Maintenance Settings */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-100">
                    <h3 className="text-lg font-medium text-orange-900 mb-4">Maintenance</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-orange-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Restart Time
                            </label>
                            <input
                                type="time"
                                {...register('settingsMetadata.restartTime')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                            {errors.settingsMetadata?.restartTime && (
                                <p className="mt-1 text-sm text-red-600">{errors.settingsMetadata.restartTime.message}</p>
                            )}
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-orange-100 flex items-center">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('settingsMetadata.autoUpdate')}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Auto Updates</span>
                                    <p className="text-xs text-gray-500">Install updates automatically</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Sticky Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 rounded-b-lg">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw className="w-4 h-4"/>
                            Reset to Defaults
                        </button>

                        <div className="flex items-center gap-4">
                            {saveStatus === 'success' && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-4 h-4"/>
                                    <span className="text-sm font-medium">Settings saved successfully</span>
                                </div>
                            )}

                            {saveStatus === 'error' && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <X className="w-4 h-4"/>
                                    <span className="text-sm font-medium">Failed to save settings</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isDirty || isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4"/>
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
