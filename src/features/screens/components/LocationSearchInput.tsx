import React, {useState} from 'react';
import {Autocomplete, useJsApiLoader} from '@react-google-maps/api';
import type {Location} from '../../../types/models/screen.types'; // Adjust path if needed

interface LocationSearchInputProps {
    initialValue: string;
    onPlaceSelect: (location: Location) => void;
}

const libraries: ('places')[] = ['places'];

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({initialValue, onPlaceSelect}) => {
    // Access the API key from your .env.local file
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

            // Gracefully handle cases where place details are not found
            const name = place.formatted_address || '';
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
        return <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"></div>;
    }

    // Show a helpful error if the API key is missing
    if (!googleMapsApiKey) {
        return <div className="text-sm text-red-600">Google Maps API Key is not configured.</div>;
    }

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            // Request only the fields you need to save costs
            fields={["formatted_address", "geometry.location"]}
        >
            <input
                type="text"
                placeholder="Search for an address..."
                // Use defaultValue so the user can immediately type to change it
                defaultValue={initialValue}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </Autocomplete>
    );
};