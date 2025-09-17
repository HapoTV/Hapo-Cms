// src/features/screens/components/screensDetails/LocationSection.tsx

import React from 'react';
import {ExternalLink, MapPin} from 'lucide-react';
import {LocationMapEmbed} from '../LocationMapEmbed';
import type {LocationSectionProps} from '../../types/screen-details.types';
import {useTheme} from '../../../../contexts/ThemeContext';
import {Alert, Button} from '../../../../components/ui';

export const LocationSection: React.FC<LocationSectionProps> = ({screen}) => {
    const {currentTheme} = useTheme();
    const hasLocation = screen?.location?.latitude && screen.location.longitude;
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // State: No Location Data
    if (!hasLocation) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    paddingBlock: currentTheme.spacing.xl
                }}
            >
                <MapPin
                    size={48}
                    style={{
                        margin: '0 auto 0.75rem',
                        color: currentTheme.colors.border.secondary
                    }}
                />
                <h4 style={{
                    fontWeight: 500,
                    color: currentTheme.colors.text.primary,
                    marginBottom: currentTheme.spacing.xs
                }}
                >
                    No Location Set
                </h4>
                <p
                    style={{
                        fontSize: currentTheme.typography.fontSize.sm,
                        color: currentTheme.colors.text.secondary
                    }}
                >
                    Location coordinates not specified for this screen.
                </p>
            </div>
        );
    }

    // State: No API Key Configured
    if (!googleMapsApiKey) {
        return (
            <Alert variant="error" title="Maps Unavailable">
                Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment
                variables.
            </Alert>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${screen.location.latitude},${screen.location.longitude}`;

    // State: Location Data Present
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.sm}}>
                    <MapPin size={20} style={{color: currentTheme.colors.brand.primary}}/>
                    <div>
                        <h4 style={{fontWeight: 500, color: currentTheme.colors.text.primary}}>
                            {screen.location.name}
                        </h4>
                        <p style={{
                            fontSize: currentTheme.typography.fontSize.sm,
                            color: currentTheme.colors.text.secondary
                        }}>
                            {screen.location.latitude.toFixed(6)}, {screen.location.longitude.toFixed(6)}
                        </p>
                    </div>
                </div>
                <a href={googleMapsUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   style={{textDecoration: 'none'}}>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ExternalLink size={16}/>}
                    >
                        Open
                    </Button>
                </a>
            </div>

            <div style={{
                borderRadius: currentTheme.borderRadius.lg,
                overflow: 'hidden',
                border: `1px solid ${currentTheme.colors.border.primary}`,
                boxShadow: currentTheme.shadows.sm
            }}>
                <LocationMapEmbed
                    latitude={screen.location.latitude}
                    longitude={screen.location.longitude}
                    locationName={screen.location.name || 'Screen Location'}
                />
            </div>
        </div>
    );
};