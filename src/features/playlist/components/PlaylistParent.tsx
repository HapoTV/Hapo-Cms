// src/features/playlist/components/PlaylistParent.tsx

import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Loader2,
    MoreVertical,
    Play,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import {usePlaylistsStore} from "../store/playlists.store.ts";

// This pure helper function can remain in the component file
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
};

const PlaylistParent = () => {
    // --- State is now managed by the Zustand store ---
    const {
        playlists,
        isLoading,
        error,
        currentPage,
        totalPages,
        searchQuery,
        fetchPlaylists,
        deletePlaylist,
        setPage,
        setSearchQuery
    } = usePlaylistsStore();

    // Local UI state for the dropdown menu can remain in the component
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    // Effect to fetch data when the component mounts or the page changes
    useEffect(() => {
        fetchPlaylists();
    }, [currentPage, fetchPlaylists]); // `fetchPlaylists` is stable, so this re-runs on page change

    // Handler to delete a playlist now calls the store action
    const handleDelete = async (id: number | null) => {
        if (id !== null) {
            await deletePlaylist(id);
            setDropdownOpen(null); // Close dropdown after action
        }
    };

    // Handler for pagination
    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setPage(page);
        }
    };

    const getStatusBadge = (isActive: boolean) => {
        const status = isActive ? 'active' : 'inactive';
        const classes = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Client-side filtering based on the search query from the store
    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Top bar with heading and create button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
                <Link
                    to="create"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Playlist
                </Link>
            </div>

            {/* Search Input */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search playlists..."
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Conditional rendering for loading, error, and content states */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
            ) : (
                <>
                    {/* Grid of Playlists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {filteredPlaylists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
                            >
                                {/* Dropdown Menu */}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setDropdownOpen(dropdownOpen === playlist.id ? null : playlist.id)}>
                                        <MoreVertical className="w-5 h-5 text-gray-500"/>
                                    </button>
                                     {dropdownOpen === playlist.id && (
                                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                                             {/* CHANGE: Corrected the link path */}
                                             <Link
                                                 to={`${playlist.id}/edit`}
                                                 className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                             >
                                                 <Edit className="w-4 h-4 mr-2"/>
                                                 Edit
                                             </Link>
                                             <button
                                                 onClick={() => handleDelete(playlist.id)}
                                                 className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                             >
                                                 <Trash2 className="w-4 h-4 mr-2"/>
                                                 Delete
                                             </button>
                                         </div>
                                     )}
                                </div>

                                {/* Card Content */}
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <Play className="w-5 h-5 text-blue-500 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
                                            {playlist.name}
                                        </h3>
                                    </div>
                                    <div className="mb-3">
                                        {getStatusBadge(playlist.playlistData.loop)}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{formatDuration(playlist.playlistData.duration)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-4 h-4 mr-2 flex items-center justify-center">📁</span>
                                        <span>{playlist.contentIds.length} items</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>Created...</span> {/* Date info is not in your DTO */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                        currentPage === index
                                            ? 'bg-blue-500 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlaylistParent;