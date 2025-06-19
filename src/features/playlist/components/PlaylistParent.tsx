// src/features/playlist/components/PlaylistParent.tsx

// @ts-ignore
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. ADD THIS IMPORT
import {
    Search,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Play,
    Pause,
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const PlaylistParent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null); // Corrected type for clarity
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    // Mock data
    const allPlaylists = [
        {
            id: 1,
            name: 'Morning Motivation',
            playlistData: { duration: '1h 45m', repeat: true },
            contentIds: [1, 2, 3, 4, 5],
        },
        {
            id: 2,
            name: 'Workout Mix',
            playlistData: { duration: '2h 15m', repeat: false },
            contentIds: [1, 2, 3, 4, 5, 6, 7],
        },
        {
            id: 3,
            name: 'Focus & Study',
            playlistData: { duration: '3h 30m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
            id: 4,
            name: 'Evening Chill',
            playlistData: { duration: '1h 20m', repeat: false },
            contentIds: [1, 2, 3],
        },
        {
            id: 5,
            name: 'Rock Classics',
            playlistData: { duration: '2h 45m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6],
        },
        {
            id: 6,
            name: 'Jazz Lounge',
            playlistData: { duration: '1h 55m', repeat: false },
            contentIds: [1, 2, 3, 4],
        },
        {
            id: 7,
            name: 'Electronic Beats',
            playlistData: { duration: '2h 30m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            id: 8,
            name: 'Acoustic Sessions',
            playlistData: { duration: '1h 35m', repeat: false },
            contentIds: [1, 2, 3, 4, 5],
        },
        {
            id: 9,
            name: 'Hip Hop Hits',
            playlistData: { duration: '2h 10m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7],
        },
        {
            id: 10,
            name: 'Classical Masterpieces',
            playlistData: { duration: '3h 15m', repeat: false },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        {
            id: 11,
            name: 'Indie Folk',
            playlistData: { duration: '1h 50m', repeat: true },
            contentIds: [1, 2, 3, 4, 5],
        },
        {
            id: 12,
            name: 'Pop Favorites',
            playlistData: { duration: '2h 25m', repeat: false },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            id: 13,
            name: 'Ambient Sounds',
            playlistData: { duration: '4h 00m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
            id: 14,
            name: 'Latin Rhythms',
            playlistData: { duration: '1h 40m', repeat: false },
            contentIds: [1, 2, 3, 4],
        },
        {
            id: 15,
            name: 'Country Roads',
            playlistData: { duration: '2h 05m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6],
        },
        {
            id: 16,
            name: 'Blues & Soul',
            playlistData: { duration: '1h 55m', repeat: false },
            contentIds: [1, 2, 3, 4, 5],
        },
        {
            id: 17,
            name: 'Reggae Vibes',
            playlistData: { duration: '2h 20m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7],
        },
        {
            id: 18,
            name: 'Metal Mayhem',
            playlistData: { duration: '1h 45m', repeat: false },
            contentIds: [1, 2, 3, 4, 5],
        },
        {
            id: 19,
            name: 'Funk & Disco',
            playlistData: { duration: '2h 35m', repeat: true },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8],
        },
        {
            id: 20,
            name: 'Meditation Music',
            playlistData: { duration: '3h 00m', repeat: false },
            contentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
    ];

    // Filter playlists based on search query
    const filteredPlaylists = allPlaylists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredPlaylists.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPlaylists = filteredPlaylists.slice(startIndex, endIndex);

    const handleDelete = async (id: number | null) => {
        // <--- DEBUGGING
        console.log('Attempting to delete playlist with ID:', id);
    };

    const getStatusBadge = (status: 'active' | 'inactive') => { // Corrected type
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

    const goToPage = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
        setDropdownOpen(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* ... Top bar with search and create button ... */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
                {/* 2. CHANGE <button> TO <Link> for navigation */}
                <Link
                    to="create" // This relative link will go to /playlist/create
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
                        className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentPlaylists.map((playlist) => (
                    <div
                        key={playlist.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() =>
                                    setDropdownOpen(
                                        dropdownOpen === playlist.id ? null : playlist.id
                                    )
                                }
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                            {dropdownOpen === playlist.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                                    <div className="py-1">
                                        <Link
                                            to={`${playlist.id}/edit`}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            onClick={() => setDropdownOpen(null)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Link>
                                        {playlist.playlistData.repeat ? (
                                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                <Pause className="w-4 h-4 mr-2" />
                                                Pause
                                            </button>
                                        ) : (
                                            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
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
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <Play className="w-5 h-5 text-blue-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
                                    {playlist.name}
                                </h3>
                            </div>
                            <div className="mb-3">
                                {getStatusBadge(
                                    playlist.playlistData.repeat ? 'active' : 'inactive'
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{playlist.playlistData.duration}</span>
                            </div>
                            <div className="flex items-center">
                <span className="w-4 h-4 mr-2 flex items-center justify-center">
                  📁
                </span>
                                <span>{playlist.contentIds.length} items</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                    currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlaylistParent