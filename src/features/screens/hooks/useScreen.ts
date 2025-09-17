import {useEffect, useState} from 'react';
import {screensService} from '../../../services/screens.service';
import type {Screen} from '../../../types';

/**
 * A custom hook to fetch a single screen's data by its ID.
 * It handles the loading and error states for the API request.
 *
 * @param screenId - The ID of the screen to fetch. Can be null or undefined.
 * @returns An object containing the screen data, a loading state, and an error state.
 */
export const useScreen = (screenId: string | undefined | null) => {
    // State for the screen data itself
    const [screen, setScreen] = useState<Screen | null>(null);

    // State to track if the data is currently being fetched
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State to store any potential errors during the fetch
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Do not attempt to fetch if there is no screenId
        if (!screenId) {
            setIsLoading(false);
            setScreen(null);
            return;
        }

        const fetchScreenData = async () => {
            // Reset state for a new fetch
            setIsLoading(true);
            setError(null);
            try {
                // Call your centralized API service
                const data = await screensService.getScreenById(screenId);
                setScreen(data);
            } catch (err) {
                console.error(`Failed to fetch screen with ID ${screenId}:`, err);
                setError('Could not load screen data. Please try again.');
                setScreen(null); // Ensure screen is null on error
            } finally {
                // Always set loading to false when the operation is complete
                setIsLoading(false);
            }
        };

        fetchScreenData();

        // The effect will re-run whenever the screenId changes
    }, [screenId]);

    // Return the state for the component to use
    return {screen, isLoading, error};
};