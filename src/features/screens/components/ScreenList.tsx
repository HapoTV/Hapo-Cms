import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Monitor } from 'lucide-react';
import { ScreenDeleteModal } from './ScreenDeleteModal';
import { ScreenStatusBadge } from './ScreenStatusBadge';

interface Screen {
  id: number;
  name: string;
  location: string | {
    name: string;
    latitude: number;
    longitude: number;
  };
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'PENDING';
  type: string;
  currentPlaylist: string | null;
}

const mockScreens: Screen[] = [
  {
    id: 1,
    name: 'Krispy Kreme1',
    location: {
      name: 'Cnr. Okavango Rd &, De Bron Rd, Brackenfell, 7562 1',
      latitude: -33.8615,
      longitude: 18.7007
    },
    status: 'ONLINE',
    type: 'WINDOWS',
    currentPlaylist: 'Summer Promotions'
  },
  {
    id: 2,
    name: 'Cafeteria Screen',
    status: 'OFFLINE',
    type: 'ANDROID',
    location: 'Cafeteria',
    currentPlaylist: null
  },
  {
    id: 3,
    name: 'Food Court Menu',
    status: 'MAINTENANCE',
    type: 'WINDOWS',
    location: 'Oceans Mall KZN',
    currentPlaylist: 'Menu Daily Specials'
  },
  {
    id: 4,
    name: 'Outdoor Advertising',
    status: 'PENDING',
    type: 'WEB',
    location: {
      name: 'Oceans Mall KZN',
      longitude: 31.0216,
      latitude: -29.8579
    },
    currentPlaylist: 'New Collection'
  }
];

export const ScreenList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<number | null>(null);

  const handleDelete = (screenId: number) => {
    setSelectedScreen(screenId);
    setShowDeleteModal(true);
  };

  return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Screens</h1>
          <Link
              to="create"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Screen
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search screens..."
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Playlist
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {mockScreens.map((screen) => (
                <tr key={screen.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Monitor className="w-5 h-5 text-gray-400 mr-2" />
                      <Link
                          to={`${screen.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {screen.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ScreenStatusBadge status={screen.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{screen.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {typeof screen.location === 'string'
                          ? screen.location
                          : screen.location.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {screen.currentPlaylist || 'None'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                        to={`${screen.id}/edit`}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 inline-flex"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => handleDelete(screen.id)}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 inline-flex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <ScreenDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              // Handle delete
              setShowDeleteModal(false);
              setSelectedScreen(null);
            }}
        />
      </div>
  );
};