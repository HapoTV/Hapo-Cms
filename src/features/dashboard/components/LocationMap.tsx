// src/features/dashboard/components/LocationMap.tsx

import React, {useEffect, useMemo, useState} from 'react';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import screensService from '../../../services/screens.service';
import type {ScreenLocationDTO} from '../../../types/models/screen.types';
import {useAuthStore} from '../../../store/auth/auth.store';
import {useTheme} from '../../../contexts/ThemeContext';
import {Alert, LoadingOverlay} from '../../../components/ui';

const LOCAL_STORAGE_KEY = 'screenLocations';
const defaultCenter = {lat: 0, lng: 0};

export const LocationMap: React.FC = () => {
    const {currentTheme} = useTheme();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const [locations, setLocations] = useState<ScreenLocationDTO[]>(() => {
        try {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

    const {isLoaded, loadError} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || '',
    });

    useEffect(() => {
        let cancelled = false;
        const fetchLocations = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            setError(null);
            try {
                const data = await screensService.getAllScreenLocations();
                if (!cancelled) {
                    setLocations(data);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                }
            } catch (e) {
                if (!cancelled) setError('Failed to load screen locations.');
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchLocations();
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const mapCenter = useMemo(() => {
        if (!locations?.length) return defaultCenter;
        const sum = locations.reduce(
            (acc, loc) => ({lat: acc.lat + loc.location.latitude, lng: acc.lng + loc.location.longitude}),
            {lat: 0, lng: 0}
        );
        return {lat: sum.lat / locations.length, lng: sum.lng / locations.length};
    }, [locations]);

    if (!apiKey || loadError) {
        return (
            <Alert variant="warning" title="Map Configuration Error">
                {!apiKey
                    ? "Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables."
                    : "Failed to load Google Maps script. Please check your API key and network connection."
                }
            </Alert>
        );
    }

    return (
        <div className="w-full">
            <div
                className="w-full h-64 lg:h-80 rounded-lg overflow-hidden relative"
                style={{backgroundColor: currentTheme.colors.background.secondary}}
            >
                <LoadingOverlay isLoading={!isLoaded || loading} message="Loading Map & Locations..."/>

                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        center={mapCenter}
                        zoom={locations.length ? 5 : 2}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            styles: currentTheme.variant === 'dark' ? [
                                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                                // ... more dark theme styles
                            ] : []
                        }}
                    >
                        {locations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={{lat: loc.location.latitude, lng: loc.location.longitude}}
                                title={loc.name}
                            />
                        ))}
                    </GoogleMap>
                )}
            </div>

            <div className="mt-2 px-1">
                {error && <Alert variant="error">{error}</Alert>}
                {!loading && !error && (
                    <p className="text-xs text-center" style={{color: currentTheme.colors.text.tertiary}}>
                        {locations.length
                            ? `Showing ${locations.length} screen location${locations.length !== 1 ? 's' : ''}`
                            : 'No screen locations available to display.'}
                    </p>
                )}
            </div>
        </div>
    );
};