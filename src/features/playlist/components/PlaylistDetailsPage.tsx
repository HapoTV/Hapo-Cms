// src/features/playlist/components/PlaylistDetailsPage.tsx

import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ChevronLeft, Edit, Loader2, Plus, Save, Search, Send, Trash2, Upload} from 'lucide-react';
import {toast} from 'react-toastify';

import {usePlaylistDetailsStore} from '../store/playlistDetails.store';
import {contentService} from '../../../services/content.service';
import {playlistService} from '../../../services/playlist.service';
import {ContentItem} from '../../../types/models/ContentItem';

import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';


// A pure helper function for formatting time
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

export default function PlaylistDetailsPage() {
    const {id: playlistId} = useParams<{ id: string }>();

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Other component state
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [libraryItems, setLibraryItems] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // --- Connect to the Zustand store ---
    const {
        playlist, items, isLoading, isSaving, error, totalDuration,
        fetchPlaylistDetails, savePlaylist, addItem, removeItem, updateItemDuration, clearState,
    } = usePlaylistDetailsStore();

    // --- Data fetching effects ---
    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails(Number(playlistId));
        }
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

    // --- Handler function for the modal's onSave prop ---
    const handlePublishToScreens = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            toast.error("No playlist or screens selected.");
            return;
        }

        try {
            // Your API might be designed to take the entire playlist object back.
            // If so, this is correct. If it's more RESTful, you might only need the ID.
            // TODO: Verify the expected payload for the publishPlaylist service method.
            const payload = {...data.playlist, screenIds: data.screenIds, publishType: data.type};
            await playlistService.publishPlaylist(payload);
            toast.success(`Playlist set to ${data.screenIds.length} screen(s)!`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            toast.error(`Failed to publish: ${message}`);
            console.error("Publishing error:", err);
        }
    };

    // --- Mock function and data prep ---
    const handleUploadMock = () => {
        const mockNewItem: ContentItem = {
            id: Math.floor(Math.random() * 10000),
            name: `New Item ${items.length + 1}`,
            url: `https://via.placeholder.com/120x160/3b82f6/ffffff?text=NEW`
        };
        addItem(mockNewItem, 5);
    };

    // Create an array of 10 slots, filled with items or null
    const padSlots = [...items, ...Array(Math.max(0, 10 - items.length)).fill(null)];

    // --- Conditional rendering for loading/error states ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2
            className="w-12 h-12 text-blue-500 animate-spin"/></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/playlists" className="flex items-center text-gray-600 hover:text-gray-800"><ChevronLeft
                        className="w-4 h-4 mr-1"/> All Playlists</Link>
                    <div className="flex items-center space-x-3">
                        <Link to={`/playlists/${playlistId}/edit`}
                              className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"><Edit
                            className="w-4 h-4 mr-1"/> Edit</Link>
                        <button onClick={() => savePlaylist()} disabled={isSaving}
                                className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Save className="w-4 h-4 mr-1"/>{isSaving ? 'Saving...' : 'Save'}</button>
                        <button onClick={() => setIsModalOpen(true)} disabled={!playlist || items.length === 0}
                                className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send className="w-4 h-4 mr-1"/> Publish
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="px-6 py-6">

                <h1 className="text-2xl font-semibold text-gray-900 mb-8">{playlist?.name || 'Playlist Details'}</h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-sm">
                    <div className="text-sm text-gray-600 mb-2">{playlist?.name}</div>
                    <div className="text-xs text-gray-500">{playlist?.description}</div>
                </div>

                {/* --- FIX: RE-INTRODUCE THE MISSING PLAYLIST SECTION --- */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Playlist Content</h2>
                        <div className="flex items-center space-x-4">
                            <button onClick={handleUploadMock}
                                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                                <Upload className="w-4 h-4 mr-1"/> Upload Media
                            </button>
                            <span
                                className="text-sm text-gray-600">Total duration <strong>{formatTime(totalDuration)}</strong></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-10 gap-4">
                        {padSlots.map((item, i) => (
                            <div key={item?.id ?? `empty-${i}`}
                                 className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                {item ? (
                                    <div className="h-full flex flex-col relative">
                                        <div className="flex-1 bg-gray-100">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover"/>
                                            <button onClick={() => removeItem(item.id)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                                                    title="Remove item">
                                                <Trash2 className="w-3 h-3"/>
                                            </button>
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button onClick={() => updateItemDuration(item.id, -1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md">-
                                                </button>
                                                <span
                                                    className="text-xs font-medium text-gray-700">{item.duration}"</span>
                                                <button onClick={() => updateItemDuration(item.id, 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md">+
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
                        <input type="text" placeholder="Search content..."
                               className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2"
                               value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    </div>

                    {/* Library Grid */}
                    <div className="grid grid-cols-5 gap-4">
                        {libraryItems.filter(item => searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 10).map((item) => (
                            <div key={item.id}
                                 className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-blue-500 cursor-pointer"
                                 onClick={() => addItem(item, item.duration || 5)}>
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 bg-gray-100"><img src={item.url} alt={item.name}
                                                                             className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="p-2 bg-white border-t border-gray-200">
                                        <div className="text-xs font-medium text-gray-700 truncate">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.type}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- FIX: CLOSE THE MAIN CONTENT WRAPPER --- */}
            </div>

            {/* Render the modal at the top level */}
            <SetToScreenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                playlist={playlist}
                onSave={handlePublishToScreens}
            />
        </div>
    );
}