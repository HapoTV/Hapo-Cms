// src/features/screens/components/ScreenInfo.tsx

import React from 'react';
import {Clock, MapPin, Monitor, PlaySquare, Settings} from 'lucide-react';
import type {ScreenInfoProps} from '../../types/screen-details.types';

export const ScreenInfo: React.FC<ScreenInfoProps> = ({screen}) => {
    return (
        <div className="space-y-8">
            {/* Basic Details */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500"/>
                    Screen Details
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400"/>
                            <span className="text-sm text-gray-600">Location</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {screen.location?.name || 'Not specified'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
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
            </div>

            {/* Current Content */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <PlaySquare className="w-5 h-5 text-green-500"/>
                    Current Content
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Active Playlist</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-700">Live</span>
                        </div>
                    </div>
                    <p className="text-blue-800 font-medium">
                        {screen.currentPlaylist?.name || "No active playlist"}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-blue-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3"/>
                            <span>Queue: {screen.playlistQueue.length} items</span>
                        </div>
                        {screen.currentPlaylist && (
                            <div className="flex items-center gap-1">
                                <PlaySquare className="w-3 h-3"/>
                                <span>Loop: {screen.currentPlaylist.playlistData.loop ? 'On' : 'Off'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Settings Overview */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500"/>
                    Quick Settings
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Loop Content</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            screen.screenSettingsDTO?.loop
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {screen.screenSettingsDTO?.loop ? 'Enabled' : 'Disabled'}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Cache Media</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            screen.screenSettingsDTO?.cacheMedia
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {screen.screenSettingsDTO?.cacheMedia ? 'Enabled' : 'Disabled'}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Fallback to Cache</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            screen.screenSettingsDTO?.fallbackToCache
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {screen.screenSettingsDTO?.fallbackToCache ? 'Enabled' : 'Disabled'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};