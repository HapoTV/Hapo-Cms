// src/features/playlist/components/PlaylistDetailsLayout.tsx

import React, {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ChevronLeft, Loader2, Upload} from 'lucide-react';
import {usePlaylistDetailsStore} from '../store/playlistDetails.store';
import {ContentItem} from '../../../types/models/ContentItem';

// A pure helper function for formatting time
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

export default function PlaylistDetailsLayout() {
    const {id: playlistId} = useParams<{ id: string }>();

    // --- Connect to the Zustand store ---
    const {
        playlist,
        items,
        isLoading,
        error,
        totalDuration,
        fetchPlaylistDetails,
        addItem,
        updateItemDuration,
        clearState,
    } = usePlaylistDetailsStore();

    // Fetch data when the component mounts or the ID changes
    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails(Number(playlistId));
        }

        // Clean up the store's state when the component unmounts
        return () => {
            clearState();
        };
    }, [playlistId, fetchPlaylistDetails, clearState]);

    const handleUploadMock = () => {
        // This is now just for mocking. In a real app, you'd add an item from the library.
        const mockNewItem: ContentItem = {
            id: Math.floor(Math.random() * 10000),
            name: `New Item ${items.length + 1}`,
            url: `https://via.placeholder.com/120x160/3b82f6/ffffff?text=NEW`,
            // ... other content properties
        };
        addItem(mockNewItem, 5); // Add with a default duration of 5s
    };

    // Create an array of 10 slots, filled with items or null
    const padSlots = [...items, ...Array(Math.max(0, 10 - items.length)).fill(null)];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/playlists" className="flex items-center text-gray-600 hover:text-gray-800">
                        <ChevronLeft className="w-4 h-4 mr-1"/>
                        All Playlists
                    </Link>
                    {/* ... other header buttons ... */}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">{playlist?.name || 'Playlist Details'}</h1>

                {/* Playlist Preview Card (Now uses data from the store) */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-sm">
                    {/* ... You can fill this with actual playlist data ... */}
                    <div className="text-sm text-gray-600 mb-2">{playlist?.name}</div>
                    <div className="text-xs text-gray-500">{playlist?.description}</div>
                </div>

                {/* Playlist Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Playlist</h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleUploadMock}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Upload className="w-4 h-4 mr-1"/>
                                Upload Media
                            </button>
                            <span className="text-sm text-gray-600">
                                Total duration <strong>{formatTime(totalDuration)}</strong>
                            </span>
                            {/* ... MoreHorizontal button ... */}
                        </div>
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-10 gap-4">
                        {padSlots.map((item, i) => (
                            <div
                                key={item?.id ?? `empty-${i}`}
                                className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                            >
                                {item ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 bg-gray-100">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button onClick={() => updateItemDuration(item.id, -1)}
                                                        className="w-6 h-6 ...">-
                                                </button>
                                                <span className="text-xs font-medium ...">{item.duration}"</span>
                                                <button onClick={() => updateItemDuration(item.id, 1)}
                                                        className="w-6 h-6 ...">+
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center ...">
                                        {/* Empty slot UI */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* ... Library Section ... */}
            </div>
        </div>
    );
}
