import React, {useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft, Plus, Save, Trash2} from 'lucide-react';
import {toast} from 'react-toastify';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';

// Import services and types
import {playlistService} from '../../../services/playlist.service';
import {ContentItem} from '../../../types/models/ContentItem';
import {PlaylistDTO} from '../../../types/models/playlist';

// Import the components this page uses
import {PlaylistForm} from './PlaylistForm';
import {PlaylistContentLibrary} from './PlaylistContentLibrary';
import SetToScreenModal, {SetToScreenSaveData} from './SetToScreenModal';

// Helper types and functions can live in the page component file
type PlaylistItem = ContentItem & {
    duration: number;
    instanceId: string; // Changed to string to work with Draggable's ID requirement
};
const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(Math.floor(seconds % 60) || 0).padStart(2, '0');
    return `${m}:${s}`;
};

// This is the complete, final version of the page component
export default function CreatePlaylistPage() {
    const navigate = useNavigate();
    const formRef = useRef<{ requestSubmit: () => void }>(null);

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

    // --- Main Submission Handler ---
    const handleCreatePlaylist = async (formData: { name: string }) => {
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

        } catch (err) {
            toast.error(`Failed to create playlist: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handler for the Modal's Save Action ---
    const handleSetToScreenSave = async (data: SetToScreenSaveData) => {
        if (!data.playlist || data.screenIds.length === 0) {
            // If the user saves without selecting screens, just navigate away
            navigate('/playlists');
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
            navigate('/playlists'); // Navigate away on success
        } catch (err) {
            toast.error(`Failed to assign to screens: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    // --- Derived State ---
    const totalDuration = useMemo(() => playlistItems.reduce((sum, item) => sum + item.duration, 0), [playlistItems]);
    const padSlots = [...playlistItems, ...Array(Math.max(0, 10 - playlistItems.length)).fill(null)];
    const selectedLibraryItemIds = useMemo(() => new Set(playlistItems.map(p => p.id)), [playlistItems]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/playlists')}
                            className="flex items-center text-gray-600 hover:text-gray-800"><ChevronLeft
                        className="w-4 h-4 mr-1"/> All Playlists
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Create New Playlist</h1>
                    <button onClick={() => formRef.current?.requestSubmit()} disabled={isSaving}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                        <Save className="w-4 h-4 mr-2"/>{isSaving ? 'Saving...' : 'Save Playlist'}
                    </button>
                </div>
            </div>

            <div className="px-6 py-8">
                {/* Section 1: Playlist Details Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <PlaylistForm ref={formRef} onSubmit={handleCreatePlaylist} initialData={{}}/>
                </div>

                {/* --- Section 2: Playlist Content Grid (with Drag-and-Drop) --- */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Playlist Content (Drag to reorder)</h2>
                        <span
                            className="text-sm text-gray-600">Total duration <strong>{formatTime(totalDuration)}</strong></span>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="playlist-slots" direction="horizontal">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}
                                     className="grid grid-cols-10 gap-4">
                                    {padSlots.map((item, i) => (
                                        item ? (
                                            <Draggable key={item.instanceId} draggableId={item.instanceId} index={i}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        className="aspect-[3/4] border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                                        <div className="h-full w-full flex flex-col relative">
                                                            <div className="flex-1 bg-gray-100">
                                                                <img src={item.metadata?.albumArtUrl || item.url}
                                                                     alt={item.name}
                                                                     className="w-full h-full object-cover"/>
                                                                <button
                                                                    onClick={() => removeItemFromPlaylist(item.instanceId)}
                                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                                                    <Trash2 className="w-3 h-3"/></button>
                                                            </div>
                                                            <div className="p-2 bg-white flex flex-col">
                                                                <div
                                                                    className="text-xs font-medium text-gray-700 truncate mb-1">{item.name}</div>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        onClick={() => updateItemDuration(item.instanceId, -1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">-
                                                                    </button>
                                                                    <span>{item.duration}"</span>
                                                                    <button
                                                                        onClick={() => updateItemDuration(item.instanceId, 1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200">+
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ) : (
                                            <div key={`empty-${i}`}
                                                 className="aspect-[3/4] border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
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
                    selectedItemIds={selectedLibraryItemIds}
                    onItemSelect={addContentToPlaylist}
                />
            </div>

            {/* The "Set to Screen" Modal that appears after successful save */}
            <SetToScreenModal
                isOpen={isModalOpen}
                onClose={() => navigate('/playlists')} // If user closes, just navigate away
                playlist={newlyCreatedPlaylist}
                onSave={handleSetToScreenSave}
            />
        </div>
    );
}
