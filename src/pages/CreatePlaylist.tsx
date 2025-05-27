import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PlaylistForm } from '../features/playlists/components/PlaylistForm';
import { usePlaylistsStore } from '../features/playlists/store/playlists.store';
import type { Playlist } from '../features/playlists/types';

export const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { createPlaylist } = usePlaylistsStore();

  const handleSubmit = async (data: Playlist) => {
    try {
      await createPlaylist(data);
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/playlists')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Playlists
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Playlist</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <PlaylistForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreatePlaylist;