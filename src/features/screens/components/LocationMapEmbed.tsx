// src/features/screens/components/LocationMapEmbed.tsx

import React from 'react';

interface LocationMapEmbedProps {
    apiKey: string;
    latitude: number;
    longitude: number;
    locationName: string;
}

export const LocationMapEmbed: React.FC<LocationMapEmbedProps> = ({
                                                                      apiKey,
                                                                      latitude,
                                                                      longitude,
                                                                      locationName,
                                                                  }) => {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;

    return (
        <div className="w-full">
            <div className="w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-gray-100">
                <iframe
                    width="100%"
                    height="100%"
                    style={{border: 0}}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapUrl}
                    title={`Map showing ${locationName}`}
                    className="w-full h-full"
                />
            </div>
            <div className="mt-2 px-1">
                <p className="text-xs text-gray-500 text-center">
                    📍 {locationName} • {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
            </div>
        </div>
    );
};