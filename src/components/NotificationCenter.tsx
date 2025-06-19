import React, { useState } from 'react';
import { Bell, Check, Eye, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Campaign Approved', message: 'Summer Sale 2024 campaign has been approved and scheduled.', type: 'success', timestamp: new Date('2024-03-15T10:30:00'), read: false },
  { id: '2', title: 'Content Upload Complete', message: 'All assets for Product Launch campaign have been uploaded successfully.', type: 'success', timestamp: new Date('2024-03-15T09:45:00'), read: false },
  { id: '3', title: 'System Maintenance', message: 'Scheduled maintenance in 2 hours. Please save your work.', type: 'warning', timestamp: new Date('2024-03-14T16:20:00'), read: true },
  { id: '4', title: 'New Feature Available', message: 'Check out our new analytics dashboard features.', type: 'info', timestamp: new Date('2024-03-14T11:15:00'), read: true }
];
export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markAsRead = (id: string) => setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));

  const getIcon = (type: 'success' | 'warning' | 'info') => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />
    };
    return icons[type];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
          )}
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {unreadCount > 0 && (
                  <div className="p-3 border-b">
                    <button onClick={markAllAsRead} className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                      <Check className="w-4 h-4 mr-1" />
                      Mark all as read
                    </button>
                  </div>
              )}

              <div className="max-h-[480px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                    <>
                      {notifications.some(n => !n.read) && (
                          <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Unread</div>
                            {notifications.filter(n => !n.read).map(notification => (
                                <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => markAsRead(notification.id)}>
                                  <div className="flex items-start gap-3">
                                    {getIcon(notification.type)}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                        <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}

                      {notifications.some(n => n.read) && (
                          <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Earlier</div>
                            {notifications.filter(n => n.read).map(notification => (
                                <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer opacity-75">
                                  <div className="flex items-start gap-3">
                                    {getIcon(notification.type)}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                        <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}
                    </>
                )}
              </div>
            </div>
        )}
      </div>
  );
};
