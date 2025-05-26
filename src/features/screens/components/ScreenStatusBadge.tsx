import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ScreenStatusBadgeProps {
  status: 'ONLINE' | 'OFFLINE';
}

export const ScreenStatusBadge: React.FC<ScreenStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    ONLINE: {
      icon: <CheckCircle className="w-4 h-4" />,
      className: 'bg-green-100 text-green-800'
    },
    OFFLINE: {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-red-100 text-red-800'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.icon}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};