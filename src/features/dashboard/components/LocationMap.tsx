import React from 'react';
import { MapPin } from 'lucide-react';

export const LocationMap = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Screen Locations</h2>
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8" />
          <p>Map integration coming soon</p>
        </div>
      </div>
    </div>
  );
};