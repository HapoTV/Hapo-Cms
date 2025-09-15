// src/features/playlist/components/PlaylistDetailsPage.tsx
import {useEffect, useRef, useState} from 'react';
import {ChevronLeft, Edit, Loader2, Save, Send, Music, RefreshCw} from 'lucide-react';
import {toast} from 'react-toastify';
import {DropResult} from 'react-beautiful-dnd';

import {usePlaylistDetailsStore} from '../store/playlistDetails.store';
import {playlistService} from '../services/playlist.service';
import {usePlaylistNavigation} from '../hooks/usePlaylistNavigation';
import {useMediaPlayerContext} from './MediaPlayerProvider';

import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';
import {PlaylistForm} from './PlaylistForm';
import {PlaylistContentLibrary} from './PlaylistContentLibrary';
import {PlaylistItemGrid} from './PlaylistItemGrid';
import { SpotifyLibrary } from './SpotifyLibrary';
import { SpotifyTrack } from '../../../types/models/Spotify';
import { ContentItem, PlaylistItemDTO } from '../types';

// Helper type for playlist items
type PlaylistItem = ContentItem & {
    duration: number;
    instanceId: string;
    isSpotify?: boolean;
    spotifyData?: {
        id: string;
        uri: string;
        album: any;
        artists: any[];
        preview_url?: string;
        external_urls: any;
    };
    thumbnailUrl?: string;
};

export default function PlaylistDetailsPage() {
    const {playlistId, goToPlaylistsList} = usePlaylistNavigation();
    const formRef = useRef<{ requestSubmit: () => void }>(null);

    // Use the media player context
    const {
        currentlyPlaying, isPlaying, handlePlay, handlePause, setSelectedVideo,
        formatTime, MUSIC_COVER_IMAGE_URL
    } = useMediaPlayerContext();

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showSpotifyLibrary, setShowSpotifyLibrary] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // --- Connect to the Zustand store ---
    const {
        playlist, items, isLoading, isSaving, error,
        fetchPlaylistDetails, savePlaylist, updateItemDuration, clearState
    } = usePlaylistDetailsStore();

    // Get playlist items from JSON storage (both regular and Spotify)
    const playlistItemsFromJson: PlaylistItem[] = (playlist?.playlistItems || []).map((item: PlaylistItemDTO, index: number) => {
        if (item.type === 'spotify') {
            // Spotify item
            return {
                id: Date.now() + index, // Temporary unique ID
                name: item.name,
                type: 'music',
                duration: item.duration || 30,
                instanceId: `spotify-${item.spotifyId}-${Date.now()}-${index}`,
                isSpotify: true,
                spotifyData: {
                    id: item.spotifyId,
                    uri: item.uri,
                    album: item.album,
                    artists: item.artists,
                    preview_url: item.preview_url,
                    external_urls: item.external_urls
                },
                thumbnailUrl: item.thumbnailUrl || MUSIC_COVER_IMAGE_URL
            } as PlaylistItem;
        } else {
            // Regular content item
            return {
                id: item.contentId || Date.now() + index,
                name: item.name,
                type: item.contentType || 'unknown',
                duration: item.duration || 30,
                instanceId: `content-${item.contentId}-${Date.now()}-${index}`,
                isSpotify: false,
                thumbnailUrl: item.thumbnailUrl || MUSIC_COVER_IMAGE_URL,
                metadata: item.metadata
            } as PlaylistItem;
        }
    });

    // Combine items from store (for backward compatibility) with JSON items
    const allPlaylistItems: PlaylistItem[] = [
        ...items.map(item => ({
            ...item,
            instanceId: `content-${item.id}-${Date.now()}`,
            isSpotify: false,
            thumbnailUrl: item.thumbnailUrl || MUSIC_COVER_IMAGE_URL
        } as PlaylistItem)),
        ...playlistItemsFromJson
    ];

    // Calculate total duration based on ALL items
    const calculatedTotalDuration = allPlaylistItems.reduce((sum, item) => sum + (item.duration || 0), 0);

    // --- Data fetching effects ---
    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails(Number(playlistId));
        }
        return () => {
            clearState();
        };
    }, [playlistId, fetchPlaylistDetails, clearState]);

    const refreshPlaylist = async () => {
        if (!playlistId) return;
        setRefreshing(true);
        try {
            await fetchPlaylistDetails(Number(playlistId));
            toast.success('Playlist refreshed');
        } catch (err) {
            toast.error('Failed to refresh playlist');
        } finally {
            setRefreshing(false);
        }
    };

    // --- Spotify Track Handler ---
    const addSpotifyTrackToPlaylist = (spotifyTrack: SpotifyTrack) => {
        if (allPlaylistItems.some(p => p.spotifyData?.id === spotifyTrack.id && p.isSpotify)) {
            toast.info(`"${spotifyTrack.name}" is already in the playlist.`);
            return;
        }
        if (allPlaylistItems.length >= 10) {
            toast.warn('Playlist is full (10 items maximum).');
            return;
        }
        
        toast.success(`"${spotifyTrack.name}" would be added to playlist (addItem function not implemented)`);
    };

    // --- Drag-and-Drop Handler ---
    const onDragEnd = (result: DropResult) => {
        if (!isEditMode) return;
        
        const {source, destination} = result;
        if (!destination) return;

        if (!isEditMode) {
            toast.info('Enable edit mode to reorder playlist items');
            return;
        }

        toast.info('Drag and drop reordering would be implemented here');
    };

    // --- Form Submission Handler ---
    const handleFormSubmit = async (formData: { name: string; description?: string }) => {
        if (!playlist) return;

        if (!formData.name) {
            toast.warn('Please provide a playlist name.');
            return;
        }

        await savePlaylist();
        setIsEditMode(false);
        toast.success('Playlist updated successfully');
    };

    // --- Handler function for the modal's onSave prop ---
    const handlePublishToScreens = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            toast.error("No playlist or screens selected.");
            return;
        }

        try {
            const playlistToPublish = {
                ...data.playlist,
                screenIds: data.screenIds,
                publishType: data.type,
                playlistData: data.playlist.playlistData || { duration: calculatedTotalDuration, loop: false, transition: 'fade' },
                contentIds: data.playlist.contentIds || [],
                screenPlaylistQueues: data.playlist.screenPlaylistQueues || []
            };

            await playlistService.publishPlaylist(playlistToPublish);
            toast.success(`Playlist set to ${data.screenIds.length} screen(s)!`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            toast.error(`Failed to publish: ${message}`);
        }
    };

    // Only consider regular content items for the library selection
    const selectedLibraryItemIds = new Set(
        items
            .map(p => p.id)
            .filter((id): id is number => id !== undefined)
    );

    // Custom remove item function
    const removeItem = (itemId: string | number) => {
        toast.info(`Item ${itemId} would be removed (removeItem function not implemented)`);
    };

    // Custom add item function
    const addItem = (item: ContentItem, duration: number) => {
        toast.info(`Item ${item.name} would be added with duration ${duration} (addItem function not implemented)`);
    };

    // --- Conditional rendering for loading/error states ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2
            className="w-12 h-12 text-blue-500 animate-spin"/></div>;
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen flex-col space-y-4">
                <div className="text-red-500">Error: {error}</div>
                <button
                    onClick={refreshPlaylist}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <button
                        onClick={goToPlaylistsList}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1"/> All Playlists
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">
                        {isEditMode ? 'Edit Playlist' : (playlist?.name || 'Playlist Details')}
                    </h1>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={refreshPlaylist}
                            disabled={refreshing}
                            className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800"
                            title="Refresh playlist"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        
                        {isEditMode ? (
                            <>
                                <button
                                    onClick={() => setIsEditMode(false)}
                                    className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => formRef.current?.requestSubmit()}
                                    disabled={isSaving}
                                    className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-1"/>{isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex items-center px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                                >
                                    <Edit className="w-4 h-4 mr-1"/> Edit
                                </button>
                                <button
                                    onClick={() => savePlaylist()}
                                    disabled={isSaving || allPlaylistItems.length === 0}
                                    className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-1"/>{isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={!playlist || allPlaylistItems.length === 0}
                                    className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4 mr-1"/> Publish
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="px-6 py-8">
                {/* Section 1: Playlist Details Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    {isEditMode ? (
                        <PlaylistForm
                            ref={formRef}
                            onSubmit={handleFormSubmit}
                            initialData={{
                                name: playlist?.name || '',
                                description: playlist?.description || ''
                            }}
                        />
                    ) : (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">{playlist?.name}</h2>
                            <p className="text-sm text-gray-600">{playlist?.description || 'No description provided.'}</p>
                        </div>
                    )}
                </div>

                {/* Section 2: Playlist Content Grid */}
                {allPlaylistItems.length > 0 ? (
                    <PlaylistItemGrid
                        items={allPlaylistItems}
                        isEditMode={isEditMode}
                        onDragEnd={onDragEnd}
                        onRemoveItem={removeItem}
                        onUpdateDuration={(itemId: string | number, change: number) => {
                            const numericId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
                            if (!isNaN(numericId)) {
                                updateItemDuration(numericId, change);
                            }
                        }}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onVideoOpen={setSelectedVideo}
                        currentlyPlaying={currentlyPlaying}
                        isPlaying={isPlaying}
                        musicCoverImageUrl={MUSIC_COVER_IMAGE_URL}
                        formatTime={formatTime}
                        totalDuration={calculatedTotalDuration}
                    />
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 mb-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <Music className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">This playlist is empty</h3>
                        <p className="text-gray-600 mb-4">
                            {isEditMode 
                                ? 'Add content from the libraries below' 
                                : 'Enable edit mode to add content to this playlist'
                            }
                        </p>
                        {!isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Enable Edit Mode
                            </button>
                        )}
                    </div>
                )}

                {/* Section 3: Content Libraries (only show in edit mode) */}
                {isEditMode && (
                    <>
                        <PlaylistContentLibrary
                            selectedItemIds={selectedLibraryItemIds}
                            onItemSelect={(item) => addItem(item, item.duration || 30)}
                        />

                        {/* Section 4: Spotify Library */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Add Music from Spotify</h2>
                                <button
                                    onClick={() => setShowSpotifyLibrary(!showSpotifyLibrary)}
                                    className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <Music className="w-4 h-4 mr-1" />
                                    {showSpotifyLibrary ? 'Hide Spotify' : 'Browse Spotify'}
                                </button>
                            </div>

                            {showSpotifyLibrary && (
                                <SpotifyLibrary
                                    selectedItemIds={new Set()}
                                    onItemSelect={addSpotifyTrackToPlaylist}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Render the modal at the top level */}
            <SetToScreenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                playlist={playlist}
                onSave={handlePublishToScreens}
            />
        </div>
    );
}