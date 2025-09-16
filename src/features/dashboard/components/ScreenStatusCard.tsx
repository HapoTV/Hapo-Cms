// components/ScreenStatusCard.tsx
// src/features/dashboard/components/ScreenStatusCard.tsx

import {useEffect, useState} from 'react';
import {Monitor} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import screensService from '../../../services/screens.service';
import {ScreenStatus} from '../../../types/models/screen.types.ts';
import {ThemeColors, useTheme} from '../../../contexts/ThemeContext';
import {Alert, Badge, Button, Card, LoadingOverlay, StatusBadge, StatusType} from '../../../components/ui';

// The shape of the data from the API
interface ScreenStatusCounts {
    ONLINE: number;
    OFFLINE: number;
    MAINTENANCE: number;
    PENDING: number;
    UNREGISTERED: number;
}

interface ScreenStats extends ScreenStatusCounts {
    quota: number;
}

// Define a specific type for the keys we'll use from the theme's status colors
type StatusColorKey = keyof ThemeColors['status'];

export const ScreenStatusCard = () => {
  // State to hold the screen statistics fetched from the API
  const [stats, setStats] = useState<ScreenStats | null>(null);
  // State to manage the loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to hold any potential error messages
  const [error, setError] = useState<string | null>(null);
    const {currentTheme} = useTheme();
    const navigate = useNavigate();

    // MOVED: The config is now inside the component to access currentTheme.
    const statusConfig: {
        label: string;
        key: ScreenStatus;
        variant: StatusType;
        colorKey: StatusColorKey | 'secondary'
    }[] = [
        {label: 'Online', key: 'ONLINE', variant: 'online', colorKey: 'success'},
        {label: 'Offline', key: 'OFFLINE', variant: 'offline', colorKey: 'error'},
        {label: 'Maintenance', key: 'MAINTENANCE', variant: 'maintenance', colorKey: 'warning'},
        {label: 'Pending', key: 'PENDING', variant: 'pending', colorKey: 'info'},
        {label: 'Unregistered', key: 'UNREGISTERED', variant: 'unregistered', colorKey: 'secondary'},
    ];

  useEffect(() => {
    const fetchScreenStats = async () => {
      try {
        setIsLoading(true);
        // This now returns the flat object: { ONLINE: 55, OFFLINE: 17, ... }
        const statusCounts = await screensService.countAllScreensByStatus();
        // Calculate the total number of screens by summing the values from the API response.
        const totalScreens = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

        // Combine the API data with the *dynamically calculated* total for the quota.
        setStats({
          ...statusCounts,
            quota: totalScreens
        });

      } catch (err) {
        setError('Failed to load screen status.');
        console.error(err);
      } finally {
        // This runs whether the fetch succeeded or failed
        setIsLoading(false);
      }
    };

    fetchScreenStats();
  }, []);

    // This function is now fully type-safe.
    const getStatusColor = (colorKey: StatusColorKey | 'secondary') => {
        if (colorKey === 'secondary') {
            return currentTheme.colors.text.secondary;
        }
        return currentTheme.colors.status[colorKey] || currentTheme.colors.text.primary;
    };

  return (
      <Card elevated padding="lg" className="relative min-h-[24rem]">
          <LoadingOverlay isLoading={isLoading}/>

          <h2 className="text-lg font-bold mb-4" style={{color: currentTheme.colors.text.primary}}>
              Screen Status
          </h2>

          {error && !isLoading && (
              <Alert variant="error" title="Error">{error}</Alert>
          )}

          {!error && !isLoading && stats && (
              <>
      <ul className="space-y-2">
          {statusConfig.map(({key, variant, colorKey}) => (
              <li
                  key={key}
                  className="flex justify-between items-center p-3 rounded-lg"
                  style={{backgroundColor: getStatusColor(colorKey) + '15'}} // Use transparent color for background
              >
                  {/* Use the StatusBadge for a consistent label with icon */}
                  <StatusBadge status={variant} showIcon={true} size="sm"/>
                  <span
                      className="font-semibold"
                      style={{color: getStatusColor(colorKey)}} // Use full color for the count
                  >
                  {stats[key]}
                </span>
          </li>
        ))}
          <li className="flex justify-between items-center p-3 rounded-lg mt-4 border"
              style={{borderColor: currentTheme.colors.border.primary}}>
              <span className="font-semibold"
                    style={{color: currentTheme.colors.text.primary}}>
                  Total Screens
              </span>
              <Badge variant="primary" size="lg">{stats.quota}</Badge>
        </li>
      </ul>

                  <div className="mt-6">
                      <Button
                          variant="ghost"
                          onClick={() => navigate('/screens')}
                          leftIcon={<Monitor className="w-4 h-4"/>}
                      >
          Manage Screens
                      </Button>
      </div>

      {stats.OFFLINE > 0 && (
          <div className="mt-4">
              <Alert variant="warning" showIcon>
                  {stats.OFFLINE} screen{stats.OFFLINE > 1 && 's'} are currently offline.
              </Alert>
        </div>
      )}
              </>
          )}
      </Card>
  );
};