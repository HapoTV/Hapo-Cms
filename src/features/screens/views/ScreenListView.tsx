import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Loader2, Monitor, MoreVertical, Plus, Search} from 'lucide-react';
import {ScreenDeleteModal} from '../components/ScreenDeleteModal';
import {ScreenStatusBadge} from '../components/ScreenStatusBadge';
import {ScreenActionsDropdown} from '../components/ScreenActionsDropdown';
import {PaginationControls} from '../../content/components/PaginationControls';
import {screensService} from '../../../services/screens.service';
import type {PlaylistQueueItem, Screen} from '../../../types/models/screen.types';

export const ScreenListView = () => {
    const [allScreens, setAllScreens] = useState<Screen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchScreens = async () => {
            try {
                setLoading(true);
                // The service call fetches ALL screens at once
                const data = await screensService.getAllScreens();
                setAllScreens(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch screens:', err);
                setError('Could not load screen data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchScreens();
    }, []);

    // Filter screens based on search query
    const filteredScreens = allScreens.filter((screen) =>
        screen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredScreens.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentScreensOnPage = filteredScreens.slice(startIndex, endIndex);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDeleteClick = (screenId: number) => {
        setSelectedScreenId(screenId);
        setShowDeleteModal(true);
        setOpenDropdownId(null);
    };

    const confirmDelete = async () => {
        if (!selectedScreenId) return;
        try {
            // Use the correct delete method from your service
            await screensService.deleteScreenPermanent(selectedScreenId);
            // Update local state to reflect deletion without a full re-fetch
            setAllScreens(allScreens.filter(s => s.id !== selectedScreenId));
        } catch (err) {
            console.error('Failed to delete screen:', err);
            setError('Failed to delete screen. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setSelectedScreenId(null);
        }
    };

    const getActivePlaylistName = (queue: PlaylistQueueItem[]): string => {
        if (!queue || queue.length === 0) return 'None';
        const activePlaylist = queue.find(p => p.isActive);
        return activePlaylist ? activePlaylist.playlistName : 'None';
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500"/>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-red-600">
                        {error}
                    </td>
                </tr>
            );
        }

        if (currentScreensOnPage.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">
                        No screens found.
                    </td>
                </tr>
            );
        }

        return currentScreensOnPage.map((screen) => (
            <tr key={screen.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <Monitor className="w-5 h-5 text-gray-400 mr-3"/>
                        <Link
                            to={`${screen.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                            {screen.name}
                        </Link>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <ScreenStatusBadge status={screen.status}/>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{screen.type}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{screen.location?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{getActivePlaylistName(screen.playlistQueue)}</div>
                </td>
                <td className="px-6 py-4 text-right relative">
                    <button
                        onClick={() => setOpenDropdownId(openDropdownId === screen.id ? null : screen.id)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <MoreVertical className="w-5 h-5"/>
                    </button>
                    {openDropdownId === screen.id && (
                        <ScreenActionsDropdown
                            screen={screen}
                            onDelete={handleDeleteClick}
                            onClose={() => setOpenDropdownId(null)}
                        />
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Screens</h1>
                <Link
                    to="create"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    <Plus className="w-5 h-5 mr-2"/>
                    Add Screen
                </Link>
            </div>

            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder="Search screens..."
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Current Playlist
                        </th>
                        <th className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {renderTableContent()}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredScreens.length}
            />

            <ScreenDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};