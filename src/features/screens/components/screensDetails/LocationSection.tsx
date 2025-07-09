// src/features/screens/components/LocationSection.tsx

import React from 'react';
import {ExternalLink, MapPin} from 'lucide-react';
import {LocationMapEmbed} from '../LocationMapEmbed';
import type {LocationSectionProps} from '../../types/screen-details.types';

export const LocationSection: React.FC<LocationSectionProps> = ({screen, googleMapsApiKey}) => {
    const hasLocation = screen?.location?.latitude && screen.location.longitude;

    if (!hasLocation) {
        return (
            <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3"/>
                <h4 className="font-medium text-gray-900 mb-1">No Location Set</h4>
                <p className="text-sm text-gray-500">Location coordinates not specified for this screen</p>
            </div>
        );
    }

    if (!googleMapsApiKey) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                <div className="text-red-600 mb-2">
                    <MapPin className="w-8 h-8 mx-auto mb-2"/>
                    <h4 className="font-semibold">Maps Unavailable</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">
                    Google Maps API key is not configured
                </p>
                <p className="text-xs text-red-600">
                    Set VITE_GOOGLE_MAPS_API_KEY in your environment variables
                </p>
            </div>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${screen.location.latitude},${screen.location.longitude}`;

    return (
        <div className="space-y-4">
            {/* Location Info Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500"/>
                    <div>
                        <h4 className="font-medium text-gray-900">{screen.location.name}</h4>
                        <p className="text-sm text-gray-500">
                            {screen.location.latitude.toFixed(6)}, {screen.location.longitude.toFixed(6)}
                        </p>
                    </div>
                </div>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open in Google Maps"
                >
                    <ExternalLink className="w-4 h-4"/>
                    Open
                </a>
            </div>

            {/* Map Embed */}
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <LocationMapEmbed
                    apiKey={googleMapsApiKey}
                    latitude={screen.location.latitude}
                    longitude={screen.location.longitude}
                    locationName={screen.location.name || 'Screen Location'}
                />
            </div>
        </div>
    );
};