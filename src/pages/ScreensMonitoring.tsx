import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Circle,
} from 'lucide-react';
// Screen interface is now more detailed, ScreensResponse is removed
import { screensService, Screen } from '../services';

const ScreensMonitoring = () => {
  const [allScreens, setAllScreens] = useState<Screen[]>([]); // Stores all screens fetched based on statusFilter
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  // Removed page and totalPages state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchScreens();
  }, [statusFilter]); // Removed page from dependencies

  const fetchScreens = async () => {
    try {
      setLoading(true);
      // Call updated service method. statusFilter can be empty string (for "All Status").
      // The service handles not adding the query param if statusFilter is empty.
      const fetchedData = await screensService.getAllScreens(statusFilter);
      setAllScreens(fetchedData);
      // Removed setTotalPages
      setError(null);
    } catch (err) {
      console.error('Error fetching screens:', err);
      setError('Failed to load screens. Please try again later.');
      setAllScreens([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for search query
  const displayedScreens = useMemo(() => {
    if (!searchQuery) {
      return allScreens;
    }
    return allScreens.filter(
      (screen) =>
        screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        screen.id.toString().includes(searchQuery.toLowerCase())
      // Add other fields to search if needed, e.g. screen.location.name
    );
  }, [allScreens, searchQuery]);

  const handleSearch = () => {
    // Search is now client-side, triggered by searchQuery state change.
    // No need to re-fetch or change page. This function can be kept if other
    // logic for 'Enter' key press is needed, or removed if not.
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    // Removed setPage(0)
  };

  const toggleDropdown = (screenId: number) => {
    setDropdownOpen(dropdownOpen === screenId ? null : screenId);
  };

  const handleDeleteScreen = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      try {
        await screensService.deleteScreen(id);
        // Refresh the list after deletion
        fetchScreens(); // Re-fetch to get the updated list
      } catch (err) {
        // <<<--- ADDED OPENING BRACE HERE
        console.error('Error deleting screen:', err); // Good to log the actual error
        setError('Failed to delete screen. Please try again later.');
      } // <<<--- ADDED CLOSING BRACE HERE
    }
  };

  const getStatusBadge = (status: 'ONLINE' | 'OFFLINE') => {
    // Type status for clarity
    const statusClasses = {
      ONLINE: 'bg-green-100 text-green-800',
      OFFLINE: 'bg-red-100 text-red-800',
    };
    const icons = {
      ONLINE: <CheckCircle className="w-4 h-4" />,
      OFFLINE: <Circle className="w-4 h-4" />, // Using Circle for OFFLINE as an example
    };
    // Ensure status is a key of statusClasses and icons
    const currentStatus = status as keyof typeof statusClasses;

    return (
      <span
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusClasses[currentStatus]}`}
      >
        {icons[currentStatus]}{' '}
        {currentStatus.charAt(0).toUpperCase() +
          currentStatus.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Screens</h1>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Screen
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Name, Type, ID"
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Status</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Loading screens...
                </td>
              </tr>
            ) : displayedScreens.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No screens found.
                </td>
              </tr>
            ) : (
              displayedScreens.map(
                (
                  screen // Use displayedScreens for rendering
                ) => (
                  <tr key={screen.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {screen.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(screen.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {screen.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {screen.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                        onClick={() => toggleDropdown(screen.id)}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {dropdownOpen === screen.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <ul
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <li
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                              role="menuitem"
                            >
                              <Edit
                                className="mr-3 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />{' '}
                              Edit
                            </li>
                            <li
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                              onClick={() => handleDeleteScreen(screen.id)}
                              role="menuitem"
                            >
                              <Trash2
                                className="mr-3 h-5 w-5 text-red-400"
                                aria-hidden="true"
                              />{' '}
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls are removed */}
      {/* 
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0 || loading}
                    className={`px-4 py-2 rounded-lg ${page === 0 || loading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1 || loading}
                    className={`px-4 py-2 rounded-lg ${page >= totalPages - 1 || loading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Next
                </button>
            </div>
            */}
    </div>
  );
};

export default ScreensMonitoring;
