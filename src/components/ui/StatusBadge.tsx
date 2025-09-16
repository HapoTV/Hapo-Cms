// src/components/ui/StatusBadge.tsx

import React from 'react';
import {AlertCircle, CheckCircle, Clock, WifiOff, Wrench, XCircle} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';
import {Badge, BadgeProps} from './Badge';

export type StatusType =
    | 'online' | 'offline' | 'maintenance' | 'pending' | 'warning' | 'unregistered'
    | 'active' | 'inactive' | 'draft' | 'scheduled' | 'completed' | 'paused'
    | 'success' | 'error' | 'info';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
    status: StatusType;
    showIcon?: boolean;
    customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                            status,
                                                            showIcon = true,
                                                            customLabel,
                                                            size = 'md',
                                                            className = '',
                                                            ...props
                                                        }) => {
    const {currentTheme} = useTheme();

    const getStatusConfig = () => {
        const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
        const {colors} = currentTheme;

        const configs = {
            // Screen/Connection statuses
            online: {
                variant: 'success' as const,
                icon: <CheckCircle className={iconSize}
                                   style={{color: colors.status.success}}/>,
                label: 'Online'
            },
            offline: {
                variant: 'error' as const,
                icon: <XCircle className={iconSize} style={{color: colors.status.error}}/>,
                label: 'Offline'
            },
            maintenance: {
                variant: 'warning' as const,
                icon: <Wrench className={iconSize} style={{color: colors.status.warning}}/>,
                label: 'Maintenance'
            },
            pending: {
                variant: 'info' as const,
                icon: <Clock className={iconSize} style={{color: colors.status.info}}/>,
                label: 'Pending'
            },
            warning: {
                variant: 'warning' as const,
                icon: <AlertCircle className={iconSize} style={{color: colors.status.warning}}/>,
                label: 'Warning'
            },
            unregistered: {
                variant: 'default' as const,
                icon: <WifiOff className={iconSize} style={{color: colors.text.secondary}}/>,
                label: 'Unregistered'
            },
            active: {
                variant: 'success' as const,
                icon: <CheckCircle className={iconSize} style={{color: colors.status.success}}/>,
                label: 'Active'
            },
            inactive: {
                variant: 'default' as const,
                icon: <XCircle className={iconSize} style={{color: colors.text.secondary}}/>,
                label: 'Inactive'
            },
            draft: {
                variant: 'default' as const,
                icon: <Clock className={iconSize} style={{color: colors.text.secondary}}/>,
                label: 'Draft'
            },
            scheduled: {
                variant: 'info' as const,
                icon: <Clock className={iconSize} style={{color: colors.status.info}}/>,
                label: 'Scheduled'
            },
            completed: {
                variant: 'success' as const,
                icon: <CheckCircle className={iconSize} style={{color: colors.status.success}}/>,
                label: 'Completed'
            },
            paused: {
                variant: 'warning' as const,
                icon: <AlertCircle className={iconSize} style={{color: colors.status.warning}}/>,
                label: 'Paused'
            },
            success: {
                variant: 'success' as const,
                icon: <CheckCircle className={iconSize} style={{color: colors.status.success}}/>,
                label: 'Success'
            },
            error: {
                variant: 'error' as const,
                icon: <XCircle className={iconSize} style={{color: colors.status.error}}/>,
                label: 'Error'
            },
            info: {
                variant: 'info' as const,
                icon: <AlertCircle className={iconSize} style={{color: colors.status.info}}/>,
                label: 'Info'
            },
        };

        return configs[status] || configs.info;
    };

    const config = getStatusConfig();
    const displayLabel = customLabel || config.label;

    return (
        <Badge
            variant={config.variant}
            size={size}
            className={`ui-status-badge ui-status-badge--${status} ${className}`}
            {...props}
        >
            <div className="flex items-center gap-2">
                {showIcon && config.icon}
                <span>{displayLabel}</span>
            </div>
        </Badge>
    );
};