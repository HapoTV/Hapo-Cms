// src/features/schedules/routes/ScheduleRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the DEFAULT export from ScheduleParent without braces.
import ScheduleParent from '../components/ScheduleParent';

export const ScheduleRoutes = () => {
    return (
        <Routes>
            {/* This will render the ScheduleParent component */}
            <Route index element={<ScheduleParent />} />
            
            {/* Add more routes for schedules feature as needed */}
            {/* <Route path="create" element={<CreateSchedulePage />} /> */}
            {/* <Route path=":id/edit" element={<ScheduleEditPage />} /> */}
        </Routes>
    );
};