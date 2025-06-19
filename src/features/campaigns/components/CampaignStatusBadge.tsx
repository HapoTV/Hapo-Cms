import React from 'react';

interface CampaignStatusBadgeProps {
  status: string;
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
  };

  const statusClass = statusClasses[status as keyof typeof statusClasses] || statusClasses.completed;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};