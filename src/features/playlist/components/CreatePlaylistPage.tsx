// src/features/playlist/components/CreatePlaylistPage.tsx

import {useMemo, useRef, useState} from 'react';
import {ChevronLeft, Save, Music} from 'lucide-react';
import {toast} from 'react-toastify';
import {DropResult} from 'react-beautiful-dnd';

// Import services and types
import {playlistService} from '../services/playlist.service';
import {ContentItem} from '../types';
import { SpotifyTrack } from '../../../types/models/Spotify';
import { PlaylistDTO } from '../../../types/models/playlist';

// Import hooks
import {usePlaylistNavigation} from '../hooks/usePlaylistNavigation';
import {useMediaPlayerContext} from './MediaPlayerProvider';

// Import the components this page uses
import {PlaylistForm} from './PlaylistForm';
import {PlaylistContentLibrary} from './PlaylistContentLibrary';
import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';
import {PlaylistItemGrid} from './PlaylistItemGrid';
import { SpotifyLibrary } from './SpotifyLibrary';

// Helper types and functions can live in the page component file
type PlaylistItem = ContentItem & {
    duration: number;
    instanceId: string;
    isSpotify?: boolean;
    spotifyData?: any;
    thumbnailUrl?: string;
};

export default function CreatePlaylistPage() {
    const {goToPlaylistsList, goToPlaylistDetails} = usePlaylistNavigation();
    const formRef = useRef<{ requestSubmit: () => void }>(null);

    // Use the media player context
    const {
        currentlyPlaying, isPlaying, handlePlay, handlePause, setSelectedVideo,
        formatTime, MUSIC_COVER_IMAGE_URL
    } = useMediaPlayerContext();

    const [isSaving, setIsSaving] = useState(false);
    const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
    const [showSpotifyLibrary, setShowSpotifyLibrary] = useState(false);
    const [addedSpotifyTracks, setAddedSpotifyTracks] = useState<Set<string>>(new Set());

    // State for the "Set to Screen" modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useState<PlaylistDTO | null>(null);

    const addContentToPlaylist = (item: ContentItem, duration: number = 30) => {
        if (playlistItems.some(p => p.id === item.id && !p.isSpotify)) {
            toast.info(`"${item.name}" is already in the playlist.`);
            return;
        }
        if (playlistItems.length >= 10) {
            toast.warn('Playlist is full (10 items maximum).');
            return;
        }
        const newItem: PlaylistItem = {
            ...item,
            duration: duration,
            instanceId: `${item.id}-${Date.now()}`,
            isSpotify: false,
            playOrder: playlistItems.length // Set playOrder based on current position
        };
        setPlaylistItems(prev => [...prev, newItem]);
    };

    const addSpotifyTrackToPlaylist = (spotifyTrack: SpotifyTrack) => {
        if (playlistItems.some(p => p.spotifyData?.id === spotifyTrack.id && p.isSpotify)) {
            toast.info(`"${spotifyTrack.name}" is already in the playlist.`);
            return;
        }
        if (playlistItems.length >= 10) {
            toast.warn('Playlist is full (10 items maximum).');
            return;
        }
        
        const spotifyItem: PlaylistItem = {
            id: Date.now(), // Temporary ID for frontend use only
            name: spotifyTrack.name,
            type: 'music',
            duration: Math.floor(spotifyTrack.duration_ms / 1000),
            instanceId: `spotify-${spotifyTrack.id}-${Date.now()}`,
            isSpotify: true,
            playOrder: playlistItems.length, // Set playOrder based on current position
            spotifyData: {
                id: spotifyTrack.id,
                uri: spotifyTrack.uri,
                album: spotifyTrack.album,
                artists: spotifyTrack.artists,
                preview_url: spotifyTrack.preview_url,
                external_urls: spotifyTrack.external_urls
            },
            thumbnailUrl: spotifyTrack.album.images[0]?.url || MUSIC_COVER_IMAGE_URL
        };
        
        setPlaylistItems(prev => [...prev, spotifyItem]);
        setAddedSpotifyTracks(prev => new Set(prev).add(spotifyTrack.id));
        toast.success(`"${spotifyTrack.name}" added to playlist`);
    };

    const removeItemFromPlaylist = (itemId: string | number) => {
        const instanceIdToRemove = String(itemId);
        const itemToRemove = playlistItems.find(p => p.instanceId === instanceIdToRemove);
        
        setPlaylistItems(prev => prev.filter(p => p.instanceId !== instanceIdToRemove));
        
        // Remove from added Spotify tracks if it was a Spotify track
        if (itemToRemove?.isSpotify && itemToRemove.spotifyData?.id) {
            setAddedSpotifyTracks(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemToRemove.spotifyData.id);
                return newSet;
            });
        }
    };

    const updateItemDuration = (itemId: string | number, change: number) => {
        const instanceIdToUpdate = String(itemId);
        setPlaylistItems(prev => prev.map(p =>
            p.instanceId === instanceIdToUpdate ? {...p, duration: Math.max(1, p.duration + change)} : p
        ));
    };

    const onDragEnd = (result: DropResult) => {
        const {source, destination} = result;
        if (!destination) return;

        const reorderedItems = Array.from(playlistItems);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        // Update playOrder for all items after reordering
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            playOrder: index
        }));

        setPlaylistItems(updatedItems);
    };


    const handleCreatePlaylist = async (formData: { name: string; description?: string }) => {
        if (!formData.name) {
            toast.warn('Please provide a playlist name.');
            return;
        }
        if (playlistItems.length === 0) {
            toast.warn('Please add at least one item.');
            return;
        }

        setIsSaving(true);
        try {
            // Prepare playlist items with proper order and structure
            const playlistItemsPayload = playlistItems.map((item, index) => {
    const baseItem = {
        playOrder: index,
        name: item.name,
        duration: item.duration,
        thumbnailUrl: item.thumbnailUrl
    };

    if (item.isSpotify) {
        return {
            ...baseItem,
            type: 'spotify',
            spotifyId: item.spotifyData?.id,
            spotifyTrackName: item.spotifyData?.name,
            spotifyArtistName: item.spotifyData?.artists?.map(a => a.name).join(', '),
            spotifyDurationMs: item.spotifyData?.duration_ms,
            spotifyPreviewUrl: item.spotifyData?.preview_url,
            spotifyImageUrl: item.spotifyData?.album?.images?.[0]?.url,
            isSpotifyContent: true
        };
    } else {
        return {
            ...baseItem,
            type: 'content',
            contentId: item.id,
            contentType: item.type,
            url: item.url,
            metadata: item.metadata,
            isSpotifyContent: false
        };
    }
});

            const totalPlaylistDuration = playlistItems.reduce((sum, item) => sum + item.duration, 0);

            const payload: Omit<PlaylistDTO, 'id'> = {
                name: formData.name,
                description: formData.description,
                playlistItems: playlistItemsPayload,
                contentIds: playlistItems
                    .filter(item => !item.isSpotify)
                    .map(item => item.id)
                    .filter((id): id is number => id !== undefined),
                playlistData: {
                    duration: totalPlaylistDuration,
                    loop: false,
                    transition: 'fade',
                },
                screenIds: [],
                screenPlaylistQueues: []
            };

            console.log('Creating playlist with payload:', JSON.stringify(payload, null, 2));

            const response = await playlistService.createPlaylist(payload);
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to create playlist");
            }

            toast.success(`Playlist "${formData.name}" created!`);
            setNewlyCreatedPlaylist(response.data);
            setModalOpen(true);

        } catch (err) {
            console.error('Playlist creation error:', err);
            toast.error(`Failed to create playlist: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetToScreenSave = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            // If no screens selected, just go to playlists list
            goToPlaylistsList();
            return;
        }
        try {
            const playlistToPublish = {
            ...data.playlist,
            screenIds: data.screenIds,
            publishType: data.type
            } as PlaylistDTO & { publishType?: string };

            const response = await playlistService.publishPlaylist(playlistToPublish);
            if (!response.success) {
                throw new Error(response.message || "Failed to publish playlist");
            }
            toast.success(`Playlist assigned to ${data.screenIds.length} screen(s).`);

            // Navigate to the details page after successful screen assignment
            if (data.playlist.id) {
                goToPlaylistDetails(data.playlist.id);
            } else {
                goToPlaylistsList();
            }
        } catch (err) {
            toast.error(`Failed to assign to screens: ${err instanceof Error ? err.message : "Unknown error"}`);
            // Even if screen assignment fails, navigate to details page since playlist was created
            if (data.playlist?.id) {
                goToPlaylistDetails(data.playlist.id);
            } else {
                goToPlaylistsList();
            }
        }
    };

    const handleModalClose = () => {
        // When modal closes without screen assignment, navigate to the newly created playlist details
        if (newlyCreatedPlaylist?.id) {
            goToPlaylistDetails(newlyCreatedPlaylist.id);
        } else {
            goToPlaylistsList();
        }
    };

    const handleSpotifyTrackSelect = (spotifyTrack: SpotifyTrack) => {
        addSpotifyTrackToPlaylist(spotifyTrack);
    };

    const totalDuration = useMemo(() => playlistItems.reduce((sum, item) => sum + item.duration, 0), [playlistItems]);
    
    // Only consider regular content items for the library selection
    const selectedLibraryItemIds = useMemo(() => 
        new Set(playlistItems
            .filter(item => !item.isSpotify)
            .map(p => p.id)
            .filter((id): id is number => id !== undefined)), 
        [playlistItems]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <button
                        onClick={goToPlaylistsList}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1"/>
                        All Playlists
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Create New Playlist</h1>
                    <button
                        onClick={() => formRef.current?.requestSubmit()}
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save className="w-4 h-4 mr-2"/>
                        {isSaving ? 'Saving...' : 'Save Playlist'}
                    </button>
                </div>
            </div>

            <div className="px-6 py-8">
                {/* Section 1: Playlist Details Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Playlist Details</h2>
                    <PlaylistForm ref={formRef} onSubmit={handleCreatePlaylist} initialData={{}}/>
                </div>

                {/* Section 2: Playlist Content Grid */}
                <PlaylistItemGrid
                    items={playlistItems}
                    isEditMode={true}
                    onDragEnd={onDragEnd}
                    onRemoveItem={removeItemFromPlaylist}
                    onUpdateDuration={updateItemDuration}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onVideoOpen={setSelectedVideo}
                    currentlyPlaying={currentlyPlaying}
                    isPlaying={isPlaying}
                    musicCoverImageUrl={MUSIC_COVER_IMAGE_URL}
                    formatTime={formatTime}
                    totalDuration={totalDuration}
                />

                {/* Section 3: Content Library */}
                <PlaylistContentLibrary
                    selectedItemIds={selectedLibraryItemIds}
                    onItemSelect={addContentToPlaylist}
                />

                {/* Section 4: Spotify Library (Separate Section) */}
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
                            selectedItemIds={addedSpotifyTracks} // Use the set of added Spotify track IDs
                            onItemSelect={handleSpotifyTrackSelect}
                        />
                    )}
                </div>
            </div>

            {/* Set to Screen Modal */}
            <SetToScreenModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                playlist={newlyCreatedPlaylist}
                onSave={handleSetToScreenSave}
            />
        </div>
    );
}