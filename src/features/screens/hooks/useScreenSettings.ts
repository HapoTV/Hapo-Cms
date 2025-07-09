// src/features/screens/hooks/useScreenSettings.ts

import {useCallback, useEffect, useState} from 'react';
import {screenSettingsService} from '../services/screen-settings.service';
import type {ScreenSettings} from '../types/settings';

export const useScreenSettings = (screenId: string) => {
    const [settings, setSettings] = useState<ScreenSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await screenSettingsService.getScreenSettings(screenId);
            setSettings(data);
        } catch (err) {
            console.error('Failed to fetch screen settings:', err);
            setError('Failed to load screen settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [screenId]);

    const updateSettings = useCallback(async (newSettings: Partial<ScreenSettings>) => {
        try {
            setIsSaving(true);
            setSaveStatus('idle');
            const updatedSettings = await screenSettingsService.updateScreenSettings(screenId, newSettings);
            setSettings(updatedSettings);
            setSaveStatus('success');

            // Clear success status after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error('Failed to update screen settings:', err);
            setSaveStatus('error');
            throw new Error('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [screenId]);

    const resetSettings = useCallback(async () => {
        try {
            setIsSaving(true);
            setSaveStatus('idle');
            const resetSettings = await screenSettingsService.resetScreenSettings(screenId);
            setSettings(resetSettings);
            setSaveStatus('success');

            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error('Failed to reset screen settings:', err);
            setSaveStatus('error');
            throw new Error('Failed to reset settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    }, [screenId]);

    useEffect(() => {
        if (screenId) {
            fetchSettings();
        }
    }, [screenId, fetchSettings]);

    return {
        settings,
        isLoading,
        error,
        isSaving,
        saveStatus,
        updateSettings,
        resetSettings,
        refetch: fetchSettings,
    };
};