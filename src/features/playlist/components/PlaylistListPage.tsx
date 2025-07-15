import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ChevronLeft, ChevronRight, Clock, Edit, Eye, Loader2, Play, Plus, Search, Trash2} from 'lucide-react';
import {usePlaylistsStore} from "../store/playlists.store";

// Pure helper function for formatting duration
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
};

export default function PlaylistListPage() {
    const {
        playlists, isLoading, error, currentPage, totalPages,
        searchQuery, fetchPlaylists, deletePlaylist, setPage, setSearchQuery
    } = usePlaylistsStore();


    // Effect to fetch data when the component mounts or the page changes
    useEffect(() => {
        fetchPlaylists();
    }, [currentPage, fetchPlaylists]);

    const handleDelete = async (id: number | null) => {
        if (id !== null) {
            await deletePlaylist(id);
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
            inactive: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header - Consistent with content library */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
                <Link
                    to="create"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2"/>
                    Create Playlist
                </Link>
            </div>

            {/* Search Input - Matches content library styling */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder="Search playlists..."
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Main Content */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin"/>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
            ) : (
                <>
                    {/* List of Playlists - Table view */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Playlist Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPlaylists.map((playlist) => (
                                <tr key={playlist.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Play className="w-5 h-5 text-blue-500 mr-2"/>
                                            <Link to={`${playlist.id}`}
                                                  className="hover:text-blue-600 transition-colors">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {playlist.name}
                                                    </span>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(playlist.playlistData.loop)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-2"/>
                                            <span>{formatDuration(playlist.playlistData.duration)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            {playlist.contentIds.length} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500">
                                            <span>Created...</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 inline-flex"
                                        >
                                            <Eye className="w-4 h-4"/>
                                        </button>
                                        <Link
                                            to={`${playlist.id}/edit`}
                                            className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 inline-flex"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(playlist.id)}
                                            className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 inline-flex"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls - Consistent with content pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8">
                            <p className="text-sm text-gray-600">
                                Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                <span className="font-medium">{totalPages}</span> ({filteredPlaylists.length} items)
                            </p>
                            <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4"/>
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === index
                                            ? 'bg-blue-500 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4"/>
                            </button>
                        </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
