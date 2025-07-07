// src/features/playlist/components/PlaylistDetailsPage.tsx

import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ChevronLeft, Edit, Loader2, Plus, Save, Send, Trash2} from 'lucide-react';
import {toast} from 'react-toastify';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';

import {usePlaylistDetailsStore} from '../store/playlistDetails.store';
import {playlistService} from '../../../services/playlist.service';

import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';
import {PlaylistForm} from './PlaylistForm';
import {PlaylistContentLibrary} from './PlaylistContentLibrary';


// A pure helper function for formatting time
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

// Placeholder for audio items without album art
const MUSIC_COVER_IMAGE_URL = 'https://placehold.co/400x400/2563eb/white?text=Audio';

export default function PlaylistDetailsPage() {
    const {id: playlistId} = useParams<{ id: string }>();
    const formRef = useRef<{ requestSubmit: () => void }>(null);

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

    // Create an array of 10 slots, filled with items or null
    const padSlots = [...items, ...Array(Math.max(0, 10 - items.length)).fill(null)];

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
                    <Link to="/playlists" className="flex items-center text-gray-600 hover:text-gray-800">
                        <ChevronLeft className="w-4 h-4 mr-1"/> All Playlists
                    </Link>
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {isEditMode ? 'Playlist Content (Drag to reorder)' : 'Playlist Content'}
                        </h2>
                        <span className="text-sm text-gray-600">
                            Total duration <strong>{formatTime(totalDuration)}</strong>
                        </span>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="playlist-slots" direction="horizontal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="grid grid-cols-10 gap-4"
                                >
                                    {padSlots.map((item, i) => (
                                        item ? (
                                            <Draggable
                                                key={`item-${item.id}`}
                                                draggableId={`item-${item.id}`}
                                                index={i}
                                                isDragDisabled={!isEditMode}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="aspect-[3/4] border rounded-lg overflow-hidden bg-gray-50"
                                                    >
                                                        <div className="h-full w-full flex flex-col relative">
                                                            <div className="flex-1 bg-gray-100">
                                                                {item.type === 'VIDEO' ? (
                                                                    <div className="w-full h-full">
                                                                        <video
                                                                            src={`${item.url}#t=0.1`}
                                                                            className="w-full h-full object-cover"
                                                                            preload="metadata"
                                                                            muted
                                                                            playsInline
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={item.type === 'AUDIO'
                                                                            ? (item.metadata?.albumArtUrl || MUSIC_COVER_IMAGE_URL)
                                                                            : item.url}
                                                                        alt={item.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                                <button
                                                                    onClick={() => removeItem(item.id)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                >
                                                                    <Trash2 className="w-3 h-3"/>
                                                                </button>
                                                            </div>
                                                            <div className="p-2 bg-white flex flex-col">
                                                                <div
                                                                    className="text-xs font-medium text-gray-700 truncate mb-1">
                                                                    {item.name}
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        onClick={() => updateItemDuration(item.id, -1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span>{item.duration}"</span>
                                                                    <button
                                                                        onClick={() => updateItemDuration(item.id, 1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ) : (
                                            <div
                                                key={`empty-${i}`}
                                                className="aspect-[3/4] border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400"
                                            >
                                                <Plus className="w-6 h-6 mb-1"/>
                                                <span className="text-xs">Empty</span>
                                            </div>
                                        )
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

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
