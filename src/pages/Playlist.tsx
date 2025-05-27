import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, MoreVertical, Play, Pause, Clock, Calendar } from 'lucide-react';
import { usePlaylistsStore } from '../features/playlists/store/playlists.store';
import { PlaylistContentTooltip } from '../features/playlists/components/PlaylistContentTooltip';

export const Playlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const { playlists, isLoading, error, fetchPlaylists, deletePlaylist } = usePlaylistsStore();

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleDelete = async (id: string) => {
    try {
      await deletePlaylist(id);
      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Modified</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playlists.map((playlist) => (
              <tr key={playlist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Play className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{playlist.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {playlist.playlistData.duration || '2h 30m'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(playlist.playlistData.repeat ? 'active' : 'inactive')}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{playlist.contentIds.length} items</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date().toLocaleDateString()}
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
                        <Link
                          to={`/playlists/${playlist.id}/edit`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                        {playlist.playlistData.repeat ? (
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </button>
                        ) : (
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
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
    </div>
  );
};

export default Playlist;