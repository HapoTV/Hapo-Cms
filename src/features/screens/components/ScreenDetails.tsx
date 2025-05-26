import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Monitor, MapPin, Calendar, Settings, Activity } from 'lucide-react';
import { ScreenStatusBadge } from './ScreenStatusBadge';

const mockScreen = {
  id: '1',
  name: 'Lobby Display',
  status: 'ONLINE' as const,
  type: 'Digital Signage',
  location: 'Main Entrance',
  orientation: 'LANDSCAPE',
  resolution: '1920x1080',
  lastActive: '2024-03-15T10:30:00Z',
  currentContent: 'Summer Sale Campaign',
  uptime: '99.9%',
  lastMaintenance: '2024-03-01T08:00:00Z'
};

export const ScreenDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('..')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Screens
      </button>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Monitor className="w-8 h-8 text-gray-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockScreen.name}</h1>
                <p className="text-gray-500">{mockScreen.type}</p>
              </div>
            </div>
            <ScreenStatusBadge status={mockScreen.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{mockScreen.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {mockScreen.resolution} ({mockScreen.orientation})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    Last Maintenance: {new Date(mockScreen.lastMaintenance).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Current Content</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{mockScreen.currentContent}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Performance</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-green-600">{mockScreen.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-gray-900">
                    {new Date(mockScreen.lastActive).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Activity className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-900">Content Updated</p>
                    <p className="text-sm text-gray-500">Today at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Activity className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-900">Screen Restarted</p>
                    <p className="text-sm text-gray-500">Yesterday at 3:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};