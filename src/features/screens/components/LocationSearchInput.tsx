// NEW PATH: src/features/screens/components/LocationSearchInput.tsx

import React, {useState} from 'react';
import {Autocomplete, useJsApiLoader} from '@react-google-maps/api';
import type {Location} from '../../../types/models/screen.types';

interface LocationSearchInputProps {
    initialValue: string;
    onPlaceSelect: (location: Location) => void;
}

const libraries: ('places')[] = ['places'];

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({initialValue, onPlaceSelect}) => {
    // Access the API key from your .env.local.local file
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey || '',
        libraries,
    });

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

    // Show a loading skeleton while the Google Maps script loads
    if (!isLoaded) {
        return <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200"></div>;
    }

    // Show a helpful error if the API key is missing
    if (!googleMapsApiKey) {
        return <div className="text-sm text-red-600">Google Maps API Key is not configured.</div>;
    }

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            // UPDATED: Request the 'name' field to get business/landmark names.
            fields={["name", "formatted_address", "geometry.location"]}
        >
            <input
                type="text"
                placeholder="Search for a place or address..."
                defaultValue={initialValue}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </Autocomplete>
    );
};