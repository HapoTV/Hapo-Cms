import React, { useState, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, MoreVertical, Play, Pause, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Playlist {
  id: number;
  name: string;
  duration: string;
  status: 'active' | 'inactive';
  lastModified: string;
  itemCount: number;
}

const mockPlaylists: Playlist[] = [
  {
    id: 1,
    name: 'Morning Rotation',
    duration: '2h 30m',
    status: 'active',
    lastModified: '2024-03-15',
    itemCount: 12
  },
  {
    id: 2,
    name: 'Afternoon Specials',
    duration: '1h 45m',
    status: 'inactive',
    lastModified: '2024-03-14',
    itemCount: 8
  },
  {
    id: 3,
    name: 'Evening Showcase',
    duration: '3h 15m',
    status: 'active',
    lastModified: '2024-03-13',
    itemCount: 15
  }
];

const Playlist: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<number | null>(null);

  const handleSelectPlaylist = (id: number) => {
    setSelectedPlaylists(prev =>
      prev.includes(id)
        ? prev.filter(playlistId => playlistId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedPlaylists(
      selectedPlaylists.length === mockPlaylists.length
        ? []
        : mockPlaylists.map(playlist => playlist.id)
    );
  };

  const handleDeleteClick = useCallback((id: number) => {
    setPlaylistToDelete(id);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  }, []);

  const handleDelete = async () => {
    // Implement delete logic here
    setShowDeleteModal(false);
    setPlaylistToDelete(null);
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
        <Link
          to="/playlists/create"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Playlist
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search playlists..."
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
                <input
                  type="checkbox"
                  checked={selectedPlaylists.length === mockPlaylists.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Modified</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPlaylists.map((playlist) => (
              <tr key={playlist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={() => handleSelectPlaylist(playlist.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Play className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{playlist.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {playlist.duration}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(playlist.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{playlist.itemCount} items</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(playlist.lastModified).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === playlist.id ? null : playlist.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {dropdownOpen === playlist.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => {/* Implement edit */}}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        {playlist.status === 'active' ? (
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {/* Implement pause */}}
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </button>
                        ) : (
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {/* Implement activate */}}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </button>
                        )}
                        <button
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          onClick={() => handleDeleteClick(playlist.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Playlist</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this playlist? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;