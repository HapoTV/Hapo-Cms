// src/features/playlist/routes/PlaylistRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the DEFAULT export from PlaylistParent without braces.
import PlaylistParent from '../components/PlaylistParent';

// Import the DEFAULT export from PlaylistForm.tsx.
// We can give it any name, but using a descriptive one like
// `CreatePlaylistPage` makes its purpose clear.
import CreatePlaylistPage from '../components/PlaylistForm';

// Import the edit page component
import { PlaylistEditPage } from '../components/PlaylistEditPage';

export const PlaylistRoutes = () => {
    return (
        <Routes>
            {/* This will now correctly render the PlaylistParent component */}
            <Route index element={<PlaylistParent />} />

            {/* Now this route renders the entire demo page component, which is what we want. */}
            <Route path="create" element={<CreatePlaylistPage />} />

            {/* Edit route that will receive the playlist ID as a parameter */}
            <Route path=":id/edit" element={<PlaylistEditPage />} />

            {/* <Route path=":id" element={<PlaylistDetails />} /> */}
        </Routes>
    );
};