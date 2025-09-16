// src/components/NotificationCenter.tsx

import React, {useEffect, useRef, useState} from 'react';
import {AlertCircle, Bell, Check, CheckCircle, Info, X} from 'lucide-react';
import {useTheme} from '../contexts/ThemeContext';
import {Badge, Button, Card} from './ui';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    timestamp: Date;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Campaign Approved',
        message: 'Summer Sale 2024 campaign has been approved and scheduled.',
        type: 'success',
        timestamp: new Date('2024-03-15T10:30:00'),
        read: false
    },
    {
        id: '2',
        title: 'Content Upload Complete',
        message: 'All assets for Product Launch campaign have been uploaded successfully.',
        type: 'success',
        timestamp: new Date('2024-03-15T09:45:00'),
        read: false
    },
    {
        id: '3',
        title: 'System Maintenance',
        message: 'Scheduled maintenance in 2 hours. Please save your work.',
        type: 'warning',
        timestamp: new Date('2024-03-14T16:20:00'),
        read: true
    },
    {
        id: '4',
        title: 'New Feature Available',
        message: 'Check out our new analytics dashboard features.',
        type: 'info',
        timestamp: new Date('2024-03-14T11:15:00'),
        read: true
    }
];

export const NotificationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const {currentTheme} = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the component's container
    const unreadCount = notifications.filter(n => !n.read).length;

    // CHANGED: Added useEffect to handle clicks outside the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);
        // Clean up the event listener when the component unmounts
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => setNotifications(notifications.map(n => ({...n, read: true})));
    const markAsRead = (id: string) => setNotifications(notifications.map(n => (n.id === id ? {...n, read: true} : n)));

    const getIcon = (type: 'success' | 'warning' | 'info') => {
        const {colors} = currentTheme;
        const iconProps = {className: "w-5 h-5 flex-shrink-0", style: {}};
        const icons = {
            success: {...iconProps, style: {color: colors.status.success}},
            warning: {...iconProps, style: {color: colors.status.warning}},
            info: {...iconProps, style: {color: colors.status.info}},
        };
        const config = icons[type];
        const IconComponent = {success: CheckCircle, warning: AlertCircle, info: Info}[type];
        return <IconComponent className={config.className} style={config.style}/>;
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
                <span className="relative">
                <Bell className="w-6 h-6"/>
                    {unreadCount > 0 && (
                        <Badge
                            variant="error"
                            size="sm"
                            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                            // CHANGED: Inline style to override for a high-contrast badge
                            style={{
                                backgroundColor: currentTheme.colors.status.error,
                                color: currentTheme.colors.text.inverse,
                            }}
                        >
            {unreadCount}
                        </Badge>
                    )}
          </span>
            </Button>

            {isOpen && (
                <Card elevated padding="none" className="absolute right-0 mt-2 w-96 z-50">
                    {/* ... (rest of the card content remains the same) ... */}
                    <div className="flex items-center justify-between p-4 border-b"
                         style={{borderColor: currentTheme.colors.border.primary}}>
                        <h3 className="font-semibold"
                            style={{color: currentTheme.colors.text.primary}}>Notifications</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5"/>
                        </Button>
                    </div>

                    {unreadCount > 0 && (
                        <div className="p-2 border-b" style={{borderColor: currentTheme.colors.border.primary}}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="w-full justify-start"
                                leftIcon={<Check className="w-4 h-4"/>}
                                style={{color: currentTheme.colors.brand.primary}}
                            >
                                Mark all as read
                            </Button>
                        </div>
                    )}

                    <div className="max-h-[480px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center" style={{color: currentTheme.colors.text.tertiary}}>No
                                notifications</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className="px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
                                    style={{
                                        borderColor: currentTheme.colors.border.primary,
                                        opacity: notification.read ? 0.7 : 1
                                    }}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        {getIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium"
                                                    style={{color: currentTheme.colors.text.primary}}>{notification.title}</h4>
                                                <span className="text-xs flex-shrink-0 ml-2"
                                                      style={{color: currentTheme.colors.text.tertiary}}>
                                                    {formatTimestamp(notification.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1"
                                               style={{color: currentTheme.colors.text.secondary}}>
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};