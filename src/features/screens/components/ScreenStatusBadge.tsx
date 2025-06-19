import React from 'react';
import {
    CheckCircle,
    XCircle,
    Wrench,
    Clock,
    AlertCircle
} from 'lucide-react';

interface ScreenStatusBadgeProps {
    status?: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING' | 'WARNING',
    size?: 'sm' | 'md' | 'lg',
}

export const ScreenStatusBadge: React.FC<ScreenStatusBadgeProps> = ({
                                                                        status,
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
        WARNING: {
            icon: <AlertCircle className={iconSizes[size]}/>,
            className: 'bg-orange-100 text-orange-800'
        }
    };

    const config = statusConfig[status];

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}>
      {config.icon}
            {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
    );
};