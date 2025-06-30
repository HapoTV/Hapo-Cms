// src/features/playlist/components/PlaylistDetailsLayout.tsx

import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ChevronLeft, Edit, Loader2, MoreHorizontal, Plus, Save, Search, Trash2, Upload} from 'lucide-react';
import {usePlaylistDetailsStore} from '../store/playlistDetails.store';
import {ContentItem} from '../../../types/models/ContentItem';
import {contentService} from '../../../services/content.service';

// A pure helper function for formatting time
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

export default function PlaylistDetailsLayout() {
    const {id: playlistId} = useParams<{ id: string }>();
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [libraryItems, setLibraryItems] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // --- Connect to the Zustand store ---
    const {
        playlist,
        items,
        isLoading,
        isSaving,
        error,
        totalDuration,
        fetchPlaylistDetails,
        savePlaylist,
        addItem,
        removeItem,
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

    // Fetch library items when the component mounts
    useEffect(() => {
        const fetchLibraryItems = async () => {
            try {
                const response = await contentService.getAllContent();
                setLibraryItems(response);
            } catch (error) {
                console.error('Error fetching library items:', error);
            }
        };

        fetchLibraryItems();
    }, []);

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
                    <div className="flex items-center space-x-3">
                        <Link
                            to={`/playlists/${playlistId}/edit`}
                            className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                        >
                            <Edit className="w-4 h-4 mr-1"/>
                            Edit
                        </Link>
                        <button
                            onClick={() => savePlaylist()}
                            disabled={isSaving}
                            className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4 mr-1"/>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
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
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(dropdownOpen ? null : 1)}
                                    className="p-1 rounded-md hover:bg-gray-100"
                                >
                                    <MoreHorizontal className="w-5 h-5 text-gray-500"/>
                                </button>
                                {dropdownOpen === 1 && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                                        <button
                                            onClick={() => {
                                                savePlaylist();
                                                setDropdownOpen(null);
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Save className="w-4 h-4 mr-2"/>
                                            Save Playlist
                                        </button>
                                        <Link
                                            to={`/playlists/${playlistId}/edit`}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Edit className="w-4 h-4 mr-2"/>
                                            Edit Details
                                        </Link>
                                    </div>
                                )}
                            </div>
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
                                    <div className="h-full flex flex-col relative">
                                        <div className="flex-1 bg-gray-100">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-3 h-3"/>
                                            </button>
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => updateItemDuration(item.id, -1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <span
                                                    className="text-xs font-medium text-gray-700">{item.duration}"</span>
                                                <button
                                                    onClick={() => updateItemDuration(item.id, 1)}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center flex-col p-4 text-gray-400">
                                        <Plus className="w-8 h-8 mb-2"/>
                                        <span className="text-xs text-center">Empty Slot</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Library Section */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Content Library</h2>

                    {/* Search Input */}
                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <input
                            type="text"
                            placeholder="Search content..."
                            className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Library Grid */}
                    <div className="grid grid-cols-5 gap-4">
                        {libraryItems
                            .filter(item =>
                                searchQuery === '' ||
                                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .slice(0, 10)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-blue-500 cursor-pointer"
                                    onClick={() => addItem(item, item.duration || 5)}
                                >
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 bg-gray-100">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                                    </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div
                                                className="text-xs font-medium text-gray-700 truncate">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.type}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
