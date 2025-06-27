// src/features/playlist/routes/PlaylistRoutes.tsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';

// Import the default export
import PlaylistParent from '../components/PlaylistParent';

// Import the DEFAULT export from PlaylistForm.tsx.
// We can give it any name, but using a descriptive one like
// `CreatePlaylistPage` makes its purpose clear.
import CreatePlaylistPage from '../components/PlaylistForm';

// Import the named exports
import {PlaylistEditPage} from '../components/PlaylistEditPage'; // <-- This will be our new component


export const PlaylistRoutes = () => {
    return (
        <Routes>
            {/* /playlists */}
            <Route index element={<PlaylistParent />} />

            {/* /playlists/create */}
            <Route path="create" element={<CreatePlaylistPage />} />

            {/* /playlists/:id/edit */}
            <Route path=":id/edit" element={<PlaylistEditPage />} />

            {/* /playlists/:id */}
            {/*           <Route path=":id" element={<PlaylistDetailsLayout />} />*/}
        </Routes>
    );
};
