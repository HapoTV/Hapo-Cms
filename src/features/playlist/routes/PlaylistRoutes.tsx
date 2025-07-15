// src/features/playlist/routes/PlaylistRoutes.tsx

import {Route, Routes} from 'react-router-dom';
import PlaylistListPage from '../components/PlaylistListPage'; // <-- RENAMED
import CreatePlaylistPage from '../components/CreatePlaylistPage';
import PlaylistDetailsPage from '../components/PlaylistDetailsPage'; // <-- RENAMED
import {PlaylistFeatureWrapper} from '../components/PlaylistFeatureWrapper';

export const PlaylistRoutes = () => {
    return (
        <PlaylistFeatureWrapper>
            <Routes>
                {/* Handles: /playlists */}
                <Route index element={<PlaylistListPage/>}/>

                {/* Handles: /playlists/create */}
                <Route path="create" element={<CreatePlaylistPage/>}/>

                {/* Handles: /playlists/:id/edit (can be the same component) */}
                <Route path=":id/edit" element={<PlaylistDetailsPage/>}/>

                {/* --- ADD THIS MISSING ROUTE --- */}
                {/* Handles: /playlists/:id */}
                <Route path=":id" element={<PlaylistDetailsPage/>}/>
            </Routes>
        </PlaylistFeatureWrapper>
    );
};
