import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, MoreVertical, CheckCircle, XCircle, Monitor } from 'lucide-react';
import { ScreenDeleteModal } from './ScreenDeleteModal';
import { ScreenStatusBadge } from './ScreenStatusBadge';

const mockScreens = [
  {
    id: 1,
    name: 'Lobby Display',
    status: 'ONLINE',
    type: 'Digital Signage',
    location: 'Main Entrance',
    lastActive: '2024-03-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Cafeteria Screen',
    status: 'OFFLINE',
    type: 'Menu Board',
    location: 'Cafeteria',
    lastActive: '2024-03-14T15:45:00Z'
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
                Last Active
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
                  <div className="text-sm text-gray-500">{screen.location}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {new Date(screen.lastActive).toLocaleString()}
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