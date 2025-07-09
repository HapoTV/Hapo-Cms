// src/features/screens/components/ScreenStatusBadge.tsx
import React from 'react';
import {AlertCircle, CheckCircle, Clock, Wrench, XCircle} from 'lucide-react';

interface ScreenStatusBadgeProps {
    status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING' | 'WARNING' | 'UNREGISTERED';
    size?: 'sm' | 'md' | 'lg';
}

export const ScreenStatusBadge: React.FC<ScreenStatusBadgeProps> = ({
                                                                        status = 'UNREGISTERED', // Provide a default value to prevent undefined
                                                                        size = 'md'
                                                                    }) => {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    // Default configuration for unknown or warning-like statuses
    const defaultIcon = <AlertCircle className={iconSizes[size]}/>;
    const defaultConfig = {
        className: 'bg-orange-100 text-orange-800',
        icon: defaultIcon
    };

    const statusConfig = {
        ONLINE: {
            icon: <CheckCircle className={iconSizes[size]}/>,
            className: 'bg-green-100 text-green-800'
        },
        OFFLINE: {
            icon: <XCircle className={iconSizes[size]}/>,
            className: 'bg-red-100 text-red-800'
        },
        MAINTENANCE: {
            icon: <Wrench className={iconSizes[size]}/>,
            className: 'bg-yellow-100 text-yellow-800'
        },
        PENDING: {
            icon: <Clock className={iconSizes[size]}/>,
            className: 'bg-blue-100 text-blue-800'
        },
        WARNING: defaultConfig,
        UNREGISTERED: defaultConfig
    };

    // Safely get the config, falling back to the default
    const config = statusConfig[status] ?? defaultConfig;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}
        >
            {config.icon}
            {statusText}
        </span>
    );
};