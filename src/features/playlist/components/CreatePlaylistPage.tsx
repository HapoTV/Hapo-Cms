import React, {useMemo, useRef, useState} from 'react';
import {ChevronLeft, Save} from 'lucide-react';
import {toast} from 'react-toastify';
import {DropResult} from 'react-beautiful-dnd';

// Import services and types
import {playlistService} from '../services/playlist.service';
import {ContentItem, PlaylistDTO} from '../types';

// Import hooks
import {usePlaylistNavigation} from '../hooks/usePlaylistNavigation';
import {useMediaPlayerContext} from './MediaPlayerProvider';

// Import the components this page uses
import {PlaylistForm} from './PlaylistForm';
import {PlaylistContentLibrary} from './PlaylistContentLibrary';
import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';
import {PlaylistItemGrid} from './PlaylistItemGrid';

// Helper types and functions can live in the page component file
type PlaylistItem = ContentItem & {
    duration: number;
    instanceId: string; // Changed to string to work with Draggable's ID requirement
};

// Helper function to format time is now provided by the useMediaPlayer hook

// This is the complete, final version of the page component
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

    // State for the "Set to Screen" modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [newlyCreatedPlaylist, setNewlyCreatedPlaylist] = useState<PlaylistDTO | null>(null);

    const addContentToPlaylist = (item: ContentItem) => {
        if (playlistItems.some(p => p.id === item.id)) {
            toast.info(`"${item.name}" is already in the playlist.`);
            return;
        }
        if (playlistItems.length >= 10) {
            toast.warn('Playlist is full (10 items maximum).');
            return;
        }
        const newItem: PlaylistItem = {
            ...item,
            duration: item.metadata?.duration || 30,
            instanceId: `${item.id}-${Date.now()}`, // Unique string ID
        };
        setPlaylistItems(prev => [...prev, newItem]);
    };

    const removeItemFromPlaylist = (instanceIdToRemove: string) => {
        setPlaylistItems(prev => prev.filter(p => p.instanceId !== instanceIdToRemove));
    };

    const updateItemDuration = (instanceIdToUpdate: string, change: number) => {
        setPlaylistItems(prev => prev.map(p =>
            p.instanceId === instanceIdToUpdate ? {...p, duration: Math.max(1, p.duration + change)} : p
        ));
    };

    // --- Drag-and-Drop Handler ---
    const onDragEnd = (result: DropResult) => {
        const {source, destination} = result;
        if (!destination) return; // Dropped outside the list

        const reorderedItems = Array.from(playlistItems);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        setPlaylistItems(reorderedItems);
    };

    // Main Submission Handler
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
            const payload: Omit<PlaylistDTO, 'id'> = {
                name: formData.name,
                // The order is preserved here from the state
                contentIds: playlistItems.map(p => p.id),
                // Add any other default metadata your backend might need
                playlistData: {
                    totalDuration: totalDuration,
                    loop: false,
                    transition: 'fade',
                },
                screenIds: [],
                screenPlaylistQueues: []
            };
            const response = await playlistService.createPlaylist(payload);
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to create playlist");
            }

            toast.success(`Playlist "${formData.name}" created!`);

            // Set the new playlist and open the modal for screen assignment
            setNewlyCreatedPlaylist(response.data);
            setModalOpen(true);

            // Navigate to the playlist details page
            if (response.data.id) {
                goToPlaylistDetails(response.data.id);
            }

        } catch (err) {
            toast.error(`Failed to create playlist: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Handler for the Modal's Save Action
    const handleSetToScreenSave = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            // If the user saves without selecting screens, just navigate away
            goToPlaylistsList();
            return;
        }
        try {
            // Create a modified playlist object with the selected screen IDs and publish type
            const playlistToPublish: PlaylistDTO & { publishType?: string } = {
                ...data.playlist,
                screenIds: data.screenIds,
                publishType: data.type
            };
            const response = await playlistService.publishPlaylist(playlistToPublish);
            if (!response.success) {
                throw new Error(response.message || "Failed to publish playlist");
            }
            toast.success(`Playlist assigned to ${data.screenIds.length} screen(s).`);

            // Navigate to the playlist details page if we have an ID
            if (data.playlist.id) {
                goToPlaylistDetails(data.playlist.id);
            } else {
                goToPlaylistsList(); // Fallback to list page
            }
        } catch (err) {
            toast.error(`Failed to assign to screens: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    // Derived State
    const totalDuration = useMemo(() => playlistItems.reduce((sum, item) => sum + item.duration, 0), [playlistItems]);
    const selectedLibraryItemIds = useMemo(() => new Set(playlistItems.map(p => p.id)), [playlistItems]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Consistent with content library */}
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
            </div>

            {/* Set to Screen Modal */}
            <SetToScreenModal
                isOpen={isModalOpen}
                onClose={goToPlaylistsList}
                playlist={newlyCreatedPlaylist}
                onSave={handleSetToScreenSave}
            />
        </div>
    );
}
