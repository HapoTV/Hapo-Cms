import React, { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import { screensService } from '../../../services/screens.service';
import type { Screen } from '../../../services/screens.service';

interface ScreenTooltipProps {
    screenId: number;
}

export const ScreenTooltip: React.FC<ScreenTooltipProps> = ({ screenId }) => {
    const [screen, setScreen] = useState<Screen | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScreen = async () => {
            try {
                const data = await screensService.getScreenById(screenId);
                setScreen(data);
            } catch (error) {
                console.error('Failed to fetch screen:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScreen();
    }, [screenId]);

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-lg">
                <div className="animate-pulse h-4 w-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!screen) {
        return null;
    }

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{screen.name}</span>
            </div>
            <div className="text-sm text-gray-600">
                <p>Type: {screen.type}</p>
                <p>Location: {screen.location.name}</p>
                <p>Status: {screen.status}</p>
            </div>
        </div>
    );
};