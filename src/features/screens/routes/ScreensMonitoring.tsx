// src/features/screens/routes/ScreensMonitoring.tsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {ScreenList} from '../components/ScreenList';
import {ScreenCreate} from '../components/ScreenCreate';
import {ScreenEdit} from '../components/ScreenEdit';
import {ScreenDetails} from '../components/ScreenDetails';

export const ScreensMonitoring = () => {
  return (
    <Routes>
      <Route index element={<ScreenList />} />
      <Route path="create" element={<ScreenCreate />} />
      <Route path=":id" element={<ScreenDetails />} />
      <Route path=":id/edit" element={<ScreenEdit />} />
    </Routes>
  );
};