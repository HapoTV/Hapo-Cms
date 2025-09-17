// src/features/screens/components/LocationMapEmbed.tsx

import React from 'react';
import {GoogleMap, Marker} from '@react-google-maps/api';
import {useGoogleMaps} from '../../../contexts/GoogleMapsProvider';
import {Alert, LoadingSpinner} from '../../../components/ui';

interface LocationMapEmbedProps {
    latitude: number;
    longitude: number;
    locationName: string;
}

const containerStyle = {
    width: '100%',
    height: '250px', // A fixed height for the map embed
};

export const LocationMapEmbed: React.FC<LocationMapEmbedProps> = ({latitude, longitude, locationName}) => {
    // 2. Get loading state from the provider
    const {isLoaded, loadError} = useGoogleMaps();

    const center = {
        lat: latitude,
        lng: longitude,
    };

    if (loadError) {
        return (
            <div style={{...containerStyle, display: 'grid', placeContent: 'center'}}>
                <Alert variant="error">Map could not be loaded.</Alert>
            </div>
        );
    }

    // 3. Conditionally render the map or a loading spinner
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15} // A reasonable default zoom level
            options={{
                disableDefaultUI: true, // Clean look, no controls
                zoomControl: true,
            }}
        >
            <Marker position={center} title={locationName}/>
        </GoogleMap>
    ) : (
        <div style={{...containerStyle, display: 'grid', placeContent: 'center'}}>
            <LoadingSpinner size="lg"/>
        </div>
    );
};