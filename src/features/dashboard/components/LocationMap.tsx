// src/features/dashboard/components/LocationMap.tsx

import React, {useEffect, useMemo, useState} from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {screensService} from '../../../services/screens.service';
import type {ScreenLocation} from '../../../types';
import {useAuthStore} from '../../../store/auth/auth.store';
import {useTheme} from '../../../contexts/ThemeContext';
// 1. Import the centralized Google Maps hook
import {useGoogleMaps} from '../../../contexts/GoogleMapsProvider';
import {Alert, LoadingOverlay} from '../../../components/ui';

const defaultCenter = {lat: 0, lng: 0};

// Dark theme styles for the map
const darkMapStyles = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}]},
    {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{color: '#263c3f'}]},
    {featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{color: '#6b9a76'}]},
    {featureType: 'road', elementType: 'geometry', stylers: [{color: '#38414e'}]},
    {featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: '#212a37'}]},
    {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#9ca5b3'}]},
    {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#746855'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#1f2835'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{color: '#f3d19c'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#2f3948'}]},
    {featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{color: '#d59563'}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#17263c'}]},
    {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#515c6d'}]},
    {featureType: 'water', elementType: 'labels.text.stroke', stylers: [{color: '#17263c'}]},
];

export const LocationMap: React.FC = () => {
    const {currentTheme} = useTheme();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    // 2. Get the loading state from the central provider
    const {isLoaded, loadError} = useGoogleMaps();

    const [locations, setLocations] = useState<ScreenLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchLocations = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await screensService.getAllScreenLocations();
                if (!cancelled) {
                    setLocations(data);
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
        const sum = locations.reduce((acc, loc) => ({
            lat: acc.lat + loc.location.latitude,
            lng: acc.lng + loc.location.longitude
        }), {lat: 0, lng: 0});
        return {lat: sum.lat / locations.length, lng: sum.lng / locations.length};
    }, [locations]);

    if (loadError) {
        return (
            <Alert variant="warning" title="Map Configuration Error">
                Failed to load Google Maps script. Please check your API key and network connection.
            </Alert>
        );
    }

    return (
        <div style={{width: '100%'}}>
            <div
                style={{
                    width: '100%',
                    height: '20rem', // Consistent height
                    borderRadius: currentTheme.borderRadius.lg,
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: currentTheme.colors.background.secondary,
                }}
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
                            styles: currentTheme.variant === 'dark' ? darkMapStyles : [],
                        }}
                    >
                        {locations.map((loc) => (
                            <Marker
                                key={loc.id} // Assuming loc.id is a string (UUID)
                                position={{lat: loc.location.latitude, lng: loc.location.longitude}}
                                title={loc.name}
                            />
                        ))}
                    </GoogleMap>
                )}
            </div>

            <div style={{marginTop: currentTheme.spacing.sm, paddingInline: currentTheme.spacing.xs}}>
                {error && <Alert variant="error">{error}</Alert>}
                {!loading && !error && (
                    <p style={{
                        fontSize: currentTheme.typography.fontSize.xs,
                        textAlign: 'center',
                        color: currentTheme.colors.text.tertiary
                    }}>
                        {locations.length
                            ? `Showing ${locations.length} screen location${locations.length !== 1 ? 's' : ''}`
                            : 'No screen locations available to display.'}
                    </p>
                )}
            </div>
        </div>
    );
};