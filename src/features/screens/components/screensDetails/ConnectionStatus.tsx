// src/features/screens/components/ConnectionStatus.tsx

import React from 'react';
import {AlertCircle, Clock, Globe, Monitor, Wifi, WifiOff} from 'lucide-react';
import type {ConnectionStatusProps} from '../../types/screen-details.types';

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({activity, activityError}) => {
    if (activityError) {
        return (
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"/>
                    <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Connection Warning</h4>
                        <p className="text-sm text-yellow-700">{activityError}</p>
                    </div>
                </div>

                <div className="text-center py-8">
                    <WifiOff className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                    <p className="text-sm text-gray-500">No active connection data available</p>
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Loading connection status...</span>
                </div>
            </div>
        );
    }

    const isConnected = activity.connected;
    const lastHeartbeat = new Date(activity.lastHeartbeat);
    const timeSinceHeartbeat = Date.now() - lastHeartbeat.getTime();
    const minutesAgo = Math.floor(timeSinceHeartbeat / (1000 * 60));

    return (
        <div className="space-y-6">
            {/* Connection Status Header */}
            <div className={`p-4 rounded-lg border-2 ${
                isConnected
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
            }`}>
                <div className="flex items-center gap-3">
                    {isConnected ? (
                        <Wifi className="w-6 h-6 text-green-600"/>
                    ) : (
                        <WifiOff className="w-6 h-6 text-red-600"/>
                    )}
                    <div>
                        <h4 className={`font-semibold ${
                            isConnected ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </h4>
                        <p className={`text-sm ${
                            isConnected ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {isConnected
                                ? 'Screen is online and responsive'
                                : 'Screen is not responding'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Details */}
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400"/>
                        <span className="text-sm text-gray-600">Last Heartbeat</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                            {lastHeartbeat.toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-500">
                            {minutesAgo === 0 ? 'Just now' : `${minutesAgo} min ago`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400"/>
                        <span className="text-sm text-gray-600">IP Address</span>
                    </div>
                    <span className="text-sm font-mono font-medium text-gray-900">
                        {activity.connectionIp}
                    </span>
                </div>

                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400"/>
                        <span className="text-sm text-gray-600">Client Info</span>
                    </div>
                    <div className="text-right max-w-[60%]">
                        <span className="text-sm font-medium text-gray-900 break-words">
                            {activity.clientInfo}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">Session ID</span>
                    </div>
                    <span className="text-sm font-mono font-medium text-gray-900">
                        {activity.sessionId.substring(0, 8)}...
                    </span>
                </div>
            </div>

            {/* Connection Quality Indicator */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Connection Quality</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isConnected && minutesAgo < 2
                            ? 'bg-green-100 text-green-800'
                            : isConnected && minutesAgo < 5
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {isConnected && minutesAgo < 2
                            ? 'Excellent'
                            : isConnected && minutesAgo < 5
                                ? 'Good'
                                : 'Poor'
                        }
                    </div>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((bar) => (
                        <div
                            key={bar}
                            className={`h-2 flex-1 rounded-sm ${
                                isConnected && minutesAgo < 2 && bar <= 5
                                    ? 'bg-green-500'
                                    : isConnected && minutesAgo < 5 && bar <= 3
                                        ? 'bg-yellow-500'
                                        : bar <= 1
                                            ? 'bg-red-500'
                                            : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};