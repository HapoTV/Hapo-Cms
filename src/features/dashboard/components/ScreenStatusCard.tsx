import React from 'react';
import { Monitor, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScreenStatusCard = () => {
  const screenStats = {
    online: 5,
    offline: 3,
    registered: 8,
    unregistered: 0,
    quota: 8
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Screen Status</h2>
      <ul className="space-y-2">
        <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <span>Online</span>
          <span>{screenStats.online}</span>
        </li>
        <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <span>Offline</span>
          <span>{screenStats.offline}</span>
        </li>
        <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <span>Registered</span>
          <span>{screenStats.registered}</span>
        </li>
        <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <span>Unregistered</span>
          <span>{screenStats.unregistered}</span>
        </li>
        <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
          <span>Device Quota</span>
          <span>{screenStats.quota}</span>
        </li>
      </ul>
      <div className="mt-4">
        <Link to="/screens" className="text-blue-500 hover:underline flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Manage Screens
        </Link>
      </div>
      {screenStats.offline > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{screenStats.offline} screens are currently offline</span>
        </div>
      )}
    </div>
  );
};