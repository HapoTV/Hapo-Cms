// src/features/screens/hooks/useScreenDetails.ts

import {useEffect, useState} from 'react';
import {screensService} from '../../../services/screens.service';
import type {Screen, ScreenConnectionStatus} from '../../../types';

export const useScreenDetails = (screenId: string | undefined) => {
    const [screen, setScreen] = useState<Screen | null>(null);
    const [activity, setActivity] = useState<ScreenConnectionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [screenError, setScreenError] = useState<string | null>(null);
    const [activityError, setActivityError] = useState<string | null>(null);

    useEffect(() => {
        if (!screenId) {
            setScreenError("No screen ID provided in URL.");
            setLoading(false);
            return;
        }


        const fetchAllDetails = async () => {
            setLoading(true);
            setScreenError(null);
            setActivityError(null);

            const [screenResult, activityResult] = await Promise.allSettled([
                screensService.getScreenById(screenId),
                screensService.getScreenActivity(screenId)
            ]);

            if (screenResult.status === 'fulfilled') {
                setScreen(screenResult.value);
            } else {
                console.error("Error fetching screen details:", screenResult.reason);
                setScreenError("Could not load the screen's main details.");
            }

            if (activityResult.status === 'fulfilled') {
                setActivity(activityResult.value);
            } else {
                console.error("Error fetching screen activity:", activityResult.reason);
                const errorData = (activityResult.reason as any)?.response?.data;
                if (errorData?.status === 404) {
                    setActivityError(errorData.message);
                } else {
                    setActivityError("Could not load connection status.");
                }
            }

            setLoading(false);
        };

        fetchAllDetails();
    }, [screenId]);

    return {
        screen,
        activity,
        loading,
        screenError,
        activityError,
    };
};