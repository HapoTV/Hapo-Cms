import React, {createContext, useContext} from 'react';
import {useJsApiLoader} from '@react-google-maps/api';

// 1. Define the libraries you need across your entire app in ONE place.
const libraries: ('places' | 'maps')[] = ['places', 'maps'];

// 2. Define the shape of the context data
interface GoogleMapsContextType {
    isLoaded: boolean;
    loadError: Error | undefined;
}

// 3. Create the React Context
const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

// 4. Create the Provider component
export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {isLoaded, loadError} = useJsApiLoader({
        id: 'google-map-script', // Keep the ID consistent
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries, // Pass the unified libraries array
    });

    const value = {isLoaded, loadError};

    return (
        <GoogleMapsContext.Provider value={value}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

// 5. Create a custom hook for easy access to the context
export const useGoogleMaps = () => {
    const context = useContext(GoogleMapsContext);
    if (context === undefined) {
        throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
    }
    return context;
};