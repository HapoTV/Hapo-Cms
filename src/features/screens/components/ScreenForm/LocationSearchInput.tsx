// src/features/screens/components/LocationSearchInput.tsx

import React, {useState} from 'react';
import {Autocomplete} from '@react-google-maps/api';
import type {Location} from '../../../../types/models/screen.types.ts';
// 1. Import the new context hook
import {useGoogleMaps} from '../../../../contexts/GoogleMapsProvider.tsx';
// 2. Import the themed Input component
import {Alert, Input} from '../../../../components/ui';

interface LocationSearchInputProps {
    initialValue: string;
    onPlaceSelect: (location: Location) => void;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({initialValue, onPlaceSelect}) => {
    // 3. Get the loading state from the central provider
    const {isLoaded, loadError} = useGoogleMaps();
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = (ac: google.maps.places.Autocomplete) => {
        setAutocomplete(ac);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            // REFINED LOGIC: Prioritize the place's common name, fallback to the address.
            const name = place.name || place.formatted_address || '';
            const latitude = place.geometry?.location?.lat() || 0;
            const longitude = place.geometry?.location?.lng() || 0;

            // Callback to the parent form with the selected location data
            onPlaceSelect({name, latitude, longitude});
        } else {
            console.error('Autocomplete is not loaded yet!');
        }
    };

    if (loadError) {
        return <Alert variant="error">Could not load Google Maps Places.</Alert>;
    }

    // Show a disabled, themed input while the script loads
    if (!isLoaded) {
        return <Input placeholder="Loading map..." disabled/>;
    }

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            // UPDATED: Request the 'name' field to get business/landmark names.
            fields={["name", "formatted_address", "geometry.location"]}
        >
            <Input
                type="text"
                placeholder="Search for a place or address..."
                defaultValue={initialValue}
            />
        </Autocomplete>
    );
};