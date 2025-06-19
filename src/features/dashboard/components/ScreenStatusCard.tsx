// components/ScreenStatusCard.tsx
// src/features/dashboard/components/ScreenStatusCard.tsx
import { useState, useEffect } from 'react';
import { Monitor, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import screensService from '../../../services/screens.service';
import { ScreenStatus } from '../../../types/models/screen.types.ts';

// The shape of the data from the API
interface ScreenStatusCounts {
  ONLINE: number;
  OFFLINE: number;
  MAINTENANCE: number;
  PENDING: number;
  UNREGISTERED: number;
}

// The shape of the component's internal state, including the calculated quota
interface ScreenStats extends ScreenStatusCounts {
  quota: number;
}

// Configuration for rendering status list items
const statusConfig: { label: string; key: ScreenStatus }[] = [
  { label: 'Online', key: 'ONLINE' },
  { label: 'Offline', key: 'OFFLINE' },
  { label: 'Maintenance', key: 'MAINTENANCE' },
  { label: 'Pending', key: 'PENDING' },
  { label: 'Unregistered', key: 'UNREGISTERED' },
];

export const ScreenStatusCard = () => {
  // State to hold the screen statistics fetched from the API
  const [stats, setStats] = useState<ScreenStats | null>(null);
  // State to manage the loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to hold any potential error messages
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchScreenStats = async () => {
      try {
        setIsLoading(true);
        // This now returns the flat object: { ONLINE: 55, OFFLINE: 17, ... }
        const statusCounts = await screensService.countAllScreensByStatus();

        // --- THE FIX IS HERE ---
        // Calculate the total number of screens by summing the values from the API response.
        const totalScreens = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

        // Combine the API data with the *dynamically calculated* total for the quota.
        setStats({
          ...statusCounts,
          quota: totalScreens, // Use the calculated total instead of a static number
        });

      } catch (err) {
        // Handle potential errors from the API call
        setError('Failed to load screen status.');
        console.error(err);
      } finally {
        // This runs whether the fetch succeeded or failed
        setIsLoading(false);
      }
    };

    fetchScreenStats();
  }, []); // The empty array [] ensures this effect runs only once on mount

  // --- Conditional Rendering ---

  // 1. Show a loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  // 2. Show an error message if the API call failed
  if (error || !stats) {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm text-red-600 flex flex-col items-center justify-center h-48">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error || 'Could not retrieve screen data.'}</p>
      </div>
    );
  }

  // --- Render with Data ---
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Screen Status</h2>
      <ul className="space-y-2">
        {/* Map over the config array to render list items dynamically */}
        {statusConfig.map(({ label, key }) => (
          <li key={key} className="flex justify-between bg-gray-100 p-2 rounded-lg">
            <span>{label}</span>
            <span className="font-semibold">{stats[key]}</span>
          </li>
        ))}
        {/* The quota now displays the dynamically calculated total */}
        <li className="flex justify-between bg-blue-50 text-blue-800 p-2 rounded-lg mt-4 border border-blue-200">
          <span className="font-semibold">Total Screens (Quota)</span>
          <span className="font-bold">{stats.quota}</span>
        </li>
      </ul>
      <div className="mt-4">
        <Link to="/screens" className="text-blue-500 hover:underline flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Manage Screens
        </Link>
      </div>
      {stats.OFFLINE > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{stats.OFFLINE} screens are currently offline</span>
        </div>
      )}
    </div>
  );
};