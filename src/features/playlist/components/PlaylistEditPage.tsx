// src/features/playlist/components/PlaylistEditPage.tsx

import React, {useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft, Loader2, Save} from 'lucide-react';

const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

export const PlaylistEditPage = () => {
    const {id: playlistId} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails(Number(playlistId));
        }
        return () => {
            clearState();
        };
    }, [playlistId, fetchPlaylistDetails, clearState]);

    const handleSave = async () => {
        if (playlist) {
            const success = await savePlaylist();
            if (success) {
                // Navigate back to the details page after a successful save
                navigate(`/playlists/${playlist.id}`);
            }
        }
    };

    const padSlots = [...items, ...Array(Math.max(0, 10 - items.length)).fill(null)];

    if (isLoading) { /* ... same loading UI ... */
    }
    if (error) { /* ... same error UI ... */
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Save/Cancel buttons */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <Link to="/playlists" className="flex items-center text-gray-600 hover:text-gray-800">
                    <ChevronLeft className="w-4 h-4 mr-1"/>
                    All Playlists
                </Link>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(`/playlists/${playlistId}`)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Save className="w-5 h-5 mr-2"/>}
                        {isSaving ? 'Saving...' : 'Save Playlist'}
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Playlist</h1>
                    <p className="text-gray-600">
                        Editing: <span className="font-semibold">{playlist.name}</span>
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg">
                    <PlaylistForm
                        onSubmit={handleUpdatePlaylist}
                        initialData={playlist}
                    />

                    {isSaving && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Saving changes...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};