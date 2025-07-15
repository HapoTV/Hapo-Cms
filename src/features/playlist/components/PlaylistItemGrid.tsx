import React from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {Plus, Trash2} from 'lucide-react';
import {ContentItem} from '../types';
import {MediaItem} from './MediaItem';

interface PlaylistItemGridProps {
    items: Array<ContentItem & { duration: number; instanceId?: string }>;
    isEditMode?: boolean;
    onDragEnd: (result: DropResult) => void;
    onRemoveItem: (itemId: string | number) => void;
    onUpdateDuration: (itemId: string | number, change: number) => void;
    onPlay: (item: ContentItem) => void;
    onPause: () => void;
    onVideoOpen: (item: ContentItem) => void;
    currentlyPlaying?: ContentItem | null;
    isPlaying?: boolean;
    musicCoverImageUrl: string;
    formatTime: (time: number) => string;
    totalDuration: number;
}

/**
 * A reusable component for displaying a grid of playlist items with drag-and-drop functionality
 */
export const PlaylistItemGrid: React.FC<PlaylistItemGridProps> = ({
                                                                      items,
                                                                      isEditMode = true,
                                                                      onDragEnd,
                                                                      onRemoveItem,
                                                                      onUpdateDuration,
                                                                      onPlay,
                                                                      onPause,
                                                                      onVideoOpen,
                                                                      currentlyPlaying,
                                                                      isPlaying = false,
                                                                      musicCoverImageUrl,
                                                                      formatTime,
                                                                      totalDuration
                                                                  }) => {
    // Create an array of 10 slots, filled with items or null
    const padSlots = [...items, ...Array(Math.max(0, 10 - items.length)).fill(null)];

    return (
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
                                        key={`item-${item.instanceId || item.id}`}
                                        draggableId={`item-${item.instanceId || item.id}`}
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
                                                        <MediaItem
                                                            item={item}
                                                            isPlaying={currentlyPlaying?.id === item.id && isPlaying}
                                                            onPlay={onPlay}
                                                            onPause={onPause}
                                                            onVideoOpen={onVideoOpen}
                                                            musicCoverImageUrl={musicCoverImageUrl}
                                                            className="h-full"
                                                        />
                                                        <button
                                                            onClick={() => onRemoveItem(item.instanceId || item.id)}
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
                                                                onClick={() => onUpdateDuration(item.instanceId || item.id, -1)}
                                                                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                                                            >
                                                                -
                                                            </button>
                                                            <span>{item.duration}s</span>
                                                            <button
                                                                onClick={() => onUpdateDuration(item.instanceId || item.id, 1)}
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
    );
};
