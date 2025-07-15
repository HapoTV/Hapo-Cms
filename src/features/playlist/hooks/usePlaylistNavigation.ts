import {useNavigate, useParams} from 'react-router-dom';
import {useCallback} from 'react';

/**
 * Custom hook for playlist navigation
 * Provides functions for navigating between playlist components
 * and preserving state during navigation
 */
export const usePlaylistNavigation = () => {
    const navigate = useNavigate();
    const {id: playlistId} = useParams<{ id: string }>();

    /**
     * Navigate to the playlist details page
     * @param id - The ID of the playlist to navigate to
     */
    const goToPlaylistDetails = useCallback((id: number) => {
        navigate(`/playlists/${id}`);
    }, [navigate]);

    /**
     * Navigate to the playlist edit page
     * @param id - The ID of the playlist to edit
     */
    const goToPlaylistEdit = useCallback((id: number) => {
        navigate(`/playlists/${id}/edit`);
    }, [navigate]);

    /**
     * Navigate to the create playlist page
     */
    const goToCreatePlaylist = useCallback(() => {
        navigate('/playlists/create');
    }, [navigate]);

    /**
     * Navigate back to the playlists list page
     */
    const goToPlaylistsList = useCallback(() => {
        navigate('/playlists');
    }, [navigate]);

    /**
     * Navigate back to the previous page
     */
    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return {
        playlistId: playlistId ? parseInt(playlistId, 10) : undefined,
        goToPlaylistDetails,
        goToPlaylistEdit,
        goToCreatePlaylist,
        goToPlaylistsList,
        goBack
    };
};