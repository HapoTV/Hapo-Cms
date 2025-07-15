// src/features/screens/views/ScreenDetailsView.tsx

import React from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft, Edit, Loader2, MapPin, Monitor, Settings} from 'lucide-react';

import {ScreenStatusBadge} from '../components/ScreenStatusBadge';
import {ConnectionStatus} from '../components/screensDetails/ConnectionStatus.tsx';
import {LocationSection} from '../components/screensDetails/LocationSection.tsx';
import {ScreenSettingsForm} from '../components/screensDetails/ScreenSettingsForm.tsx';
import {ErrorBoundary} from '../../../components/ErrorBoundary';

import {useScreenDetails} from '../hooks/useScreenDetails';
import {useScreenSettings} from '../hooks/useScreenSettings';
import type {SettingsFormData} from '../types/screen-details.types';

export const ScreenDetailsView = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Use custom hooks for data management
    const {
        screen,
        activity,
        loading,
        screenError,
        activityError,
    } = useScreenDetails(id);

    const {
        settings,
        isLoading: settingsLoading,
        error: settingsError,
        isSaving,
        saveStatus,
        updateSettings,
        resetSettings,
    } = useScreenSettings(id || '');

    // Event handlers
    const handleSettingsSave = async (data: SettingsFormData) => {
        await updateSettings(data);
    };

    const handleSettingsReset = async () => {
        await resetSettings();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500"/>
            </div>
        );
    }

    // Error state
    if (screenError || !screen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <h2 className="text-xl font-semibold mb-2">Error Loading Screen</h2>
                    <p>{screenError || 'Screen data is unavailable.'}</p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-50">
                {/* Full-width header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1"/>
                                    Back
                                </button>
                                <div className="h-6 w-px bg-gray-300"/>
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-8 h-8 text-gray-400"/>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{screen.name}</h1>
                                        <p className="text-sm text-gray-500">{screen.type} Screen</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ScreenStatusBadge status={screen.status} size="lg"/>
                                <Link
                                    to={`/screens/${id}/edit`}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-2"/>
                                    Edit Screen
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area - fixed for laptop screens */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 gap-8 min-h-[600px]">
                        {/* Unified Card - Contains all information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                {/* Left Side - Screen Info */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Monitor className="w-5 h-5 text-blue-500"/>
                                        Screen Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div
                                            className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400"/>
                                                <span className="text-sm text-gray-600">Location</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {screen.location?.name || 'Not specified'}
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-4 h-4 text-gray-400"/>
                                                <span className="text-sm text-gray-600">Resolution</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {screen.metadata?.resolution || 'Default'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="w-4 h-4 text-gray-400"/>
                                                <span className="text-sm text-gray-600">Type</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{screen.type}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Connection Status</h2>
                                        <ConnectionStatus activity={activity} activityError={activityError}/>
                                    </div>
                                </div>

                                {/* Right Side - Location */}
                                <div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                                        <LocationSection screen={screen} googleMapsApiKey={googleMapsApiKey}/>
                                    </div>
                                </div>
                            </div>

                            {/* Settings Section - Full Width */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Display Settings</h2>

                                {settingsLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500"/>
                                    </div>
                                ) : settingsError ? (
                                    <div className="bg-red-50 p-4 rounded-lg text-red-600 border border-red-200">
                                        <h3 className="font-medium mb-1">Error Loading Settings</h3>
                                        <p className="text-sm">{settingsError}</p>
                                    </div>
                                ) : settings ? (
                                    <ScreenSettingsForm
                                        settings={settings}
                                        onSave={handleSettingsSave}
                                        onReset={handleSettingsReset}
                                        isSaving={isSaving}
                                        saveStatus={saveStatus}
                                    />
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Monitor className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                                        <p>No settings available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};
