import React from 'react';
import { Clock, Monitor } from 'lucide-react';

interface PlaylistContentTooltipProps {
  content: {
    id: number;
    name: string;
    type: string;
    duration?: string;
    screens?: string[];
  };
}

export const PlaylistContentTooltip: React.FC<PlaylistContentTooltipProps> = ({ content }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="font-medium text-gray-900 mb-2">{content.name}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{content.duration || 'N/A'}</span>
        </div>
        {content.screens && content.screens.length > 0 && (
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>{content.screens.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};