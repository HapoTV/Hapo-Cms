// src/features/playlist/components/PlaylistDetailsPage.tsx

import React, {useEffect, useRef, useState} from 'react';
import {ChevronLeft, Edit, Loader2, Save, Send} from 'lucide-react';
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

    // --- Connect to the Zustand store ---
    const {
        playlist, items, isLoading, isSaving, error, totalDuration,
        fetchPlaylistDetails, savePlaylist, addItem, removeItem, updateItemDuration, clearState, reorderItems
    } = usePlaylistDetailsStore();

    // --- Data fetching effects ---
    useEffect(() => {
        if (playlistId) {
            fetchPlaylistDetails(Number(playlistId));
        }
        return () => {
            clearState();
        };
    }, [playlistId, fetchPlaylistDetails, clearState]);

    // --- Drag-and-Drop Handler ---
    const onDragEnd = (result: DropResult) => {
        const {source, destination} = result;
        if (!destination) return; // Dropped outside the list

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        reorderItems(reorderedItems);
    };

    // --- Form Submission Handler ---
    const handleFormSubmit = async (formData: { name: string }) => {
        if (!playlist) return;

        if (!formData.name) {
            toast.warn('Please provide a playlist name.');
            return;
        }

        // Update the playlist name in the store and save
        if (playlist.name !== formData.name) {
            // In a real implementation, you would update the playlist name in the store here
            // For now, we'll just save the playlist as is
            toast.info(`Playlist name would be updated to "${formData.name}"`);
        }

        // Save the updated playlist
        await savePlaylist();
        setIsEditMode(false);
    };

    // --- Handler function for the modal's onSave prop ---
    const handlePublishToScreens = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            toast.error("No playlist or screens selected.");
            return;
        }

        try {
            // Your API might be designed to take the entire playlist object back.
            // If so, this is correct. If it's more RESTful, you might only need the ID.
            // TODO: Verify the expected payload for the publishPlaylist service method.
            const payload = {...data.playlist, screenIds: data.screenIds, publishType: data.type};
            await playlistService.publishPlaylist(payload);
            toast.success(`Playlist set to ${data.screenIds.length} screen(s)!`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            toast.error(`Failed to publish: ${message}`);
            console.error("Publishing error:", err);
        }
    };


    // --- Conditional rendering for loading/error states ---
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2
            className="w-12 h-12 text-blue-500 animate-spin"/></div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
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
                        {isEditMode ? (
                            <button
                                onClick={() => formRef.current?.requestSubmit()}
                                disabled={isSaving}
                                className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4 mr-1"/>{isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
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
                                    disabled={isSaving}
                                    className="flex items-center px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4 mr-1"/>{isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={!playlist || items.length === 0}
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
                            initialData={{name: playlist?.name || ''}}
                        />
                    ) : (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-2">{playlist?.name}</h2>
                            <p className="text-sm text-gray-600">{playlist?.description || 'No description provided.'}</p>
                        </div>
                    )}
                </div>

                {/* Section 2: Playlist Content Grid (with Drag-and-Drop) */}
                <PlaylistItemGrid
                    items={items}
                    isEditMode={isEditMode}
                    onDragEnd={onDragEnd}
                    onRemoveItem={removeItem}
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
                    selectedItemIds={new Set(items.map(item => item.id))}
                    onItemSelect={(item) => addItem(item, item.duration || 5)}
                />
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
