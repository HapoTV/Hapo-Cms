import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from '../features/auth/routes/Auth';
import { Dashboard } from '../features/dashboard/routes/Dashboard';
import { ContentLibrary } from '../features/content/routes/ContentLibrary';
import { CampaignManagement } from '../features/campaigns/routes/CampaignManagement';
import { ScreensMonitoring } from '../features/screens/routes/ScreensMonitoring';
import { Settings } from '../features/settings/routes/Settings';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from '../layouts/MainLayout';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="content/*" element={<ContentLibrary />} />
          <Route path="campaigns/*" element={<CampaignManagement />} />
          <Route path="screens/*" element={<ScreensMonitoring />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};