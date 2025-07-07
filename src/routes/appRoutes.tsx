// This file defines the main application routes for the React application.
// It includes routes for authentication, dashboard, content library, campaign management, screens monitoring, playlist management, schedule management, and settings.
// It uses React Router for routing and includes a private route wrapper to protect certain routes.
// src/routes/appRoutes.tsx

import {Navigate, Route, Routes} from 'react-router-dom';
import {Auth} from '../features/auth/routes/Auth';
import {Dashboard} from '../features/dashboard/routes/Dashboard';
import {ContentLibrary} from '../features/content/routes/ContentLibrary';
import {CampaignManagement} from '../features/campaigns/routes/CampaignManagement';
import {ScreensRoutes} from '../features/screens/routes/ScreensRoutes.tsx';
import {PlaylistRoutes} from '../features/playlist/routes/PlaylistRoutes';
import {ScheduleRoutes} from '../features/schedules/routes/ScheduleRoutes';
import {HelpCenter} from '../features/help/routes/HelpCenter';
import {Settings} from '../features/settings/routes/Settings';
import {PrivateRoute} from './PrivateRoute';
import {MainLayout} from '../layouts/MainLayout';
import {ErrorBoundary} from '../components/ErrorBoundary';

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/auth" element={<Auth />} />

          <Route
              element={
                  <PrivateRoute>
                      <MainLayout/>
                  </PrivateRoute>
              }
          >
          <Route index element={<Dashboard />} />
          <Route path="content/*" element={<ContentLibrary />} />
          <Route path="campaigns/*" element={<CampaignManagement />} />
              <Route path="screens/*" element={<ScreensRoutes/>}/>
          <Route path="schedules/*" element={<ScheduleRoutes />} />
          <Route path="playlists/*" element={<PlaylistRoutes/>}/>
              <Route path="help/*" element={<HelpCenter/>}/>
          <Route path="settings/*" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};
