import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Plus, Trash2 } from "lucide-react";
import { ContentItem } from "../types";
import { MediaItem } from "./MediaItem";

interface PlaylistItemGridProps {
  items: Array<
    ContentItem & {
      duration: number;
      instanceId?: string;
      isSpotify?: boolean;
      spotifyData?: any;
      playOrder?: number;
    }
  >;
  isEditMode?: boolean;
  onDragEnd: (result: DropResult) => void;
  onRemoveItem: (itemId: string | number) => void;
  onUpdateDuration: (itemId: string | number, change: number) => void;
  onPlay: (item: ContentItem | any) => void;
  onPause: () => void;
  onVideoOpen: (item: ContentItem) => void;
  currentlyPlaying?: ContentItem | any | null;
  isPlaying?: boolean;
  musicCoverImageUrl: string;
  formatTime: (time: number) => string;
  totalDuration: number;
}

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
  totalDuration,
}) => {
  // Sort items by playOrder if available
  const sortedItems = React.useMemo(() => {
    if (items.every((item) => item.playOrder !== undefined)) {
      return [...items].sort(
        (a, b) => (a.playOrder || 0) - (b.playOrder || 0)
      );
    }
    return items;
  }, [items]);

  // Always show 10 slots
  const padSlots = [
    ...sortedItems,
    ...Array(Math.max(0, 10 - sortedItems.length)).fill(null),
  ];

  const getItemKey = (item: ContentItem & { instanceId?: string }) =>
    item.instanceId || item.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditMode
            ? "Playlist Content (Drag to reorder)"
            : "Playlist Content"}
        </h2>
        <span className="text-sm text-gray-600">
          Total duration <strong>{formatTime(totalDuration)}</strong>
          {sortedItems.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({sortedItems.length} item
              {sortedItems.length !== 1 ? "s" : ""})
            </span>
          )}
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
              {padSlots.map((item, index) =>
                item ? (
                  <Draggable
                    key={`item-${getItemKey(item)}`}
                    draggableId={`item-${getItemKey(item)}`}
                    index={index}
                    isDragDisabled={!isEditMode}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`aspect-[3/4] border rounded-lg overflow-hidden bg-gray-50 transition-transform ${
                          snapshot.isDragging
                            ? "shadow-lg transform rotate-3"
                            : ""
                        }`}
                        style={{
                          ...provided.draggableProps.style,
                          zIndex: snapshot.isDragging ? 1000 : "auto",
                        }}
                      >
                        <div className="h-full w-full flex flex-col relative">
                          {isEditMode && (
                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded z-10">
                              {index + 1}
                            </div>
                          )}

                          <div className="flex-1 bg-gray-100 relative">
                            <MediaItem
                              item={item}
                              isSpotify={item.isSpotify}
                              isPlaying={
                                currentlyPlaying?.id === item.id && isPlaying
                              }
                              onPlay={onPlay}
                              onPause={onPause}
                              onVideoOpen={onVideoOpen}
                              musicCoverImageUrl={musicCoverImageUrl}
                              className="h-full"
                            />
                            {isEditMode && (
                              <button
                                onClick={() =>
                                  onRemoveItem(getItemKey(item))
                                }
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                                aria-label="Remove item"
                                title="Remove item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="p-2 bg-white flex flex-col">
                            <div className="text-xs font-medium text-gray-700 truncate mb-1">
                              {item.name}
                            </div>

                            {isEditMode && (
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateDuration(getItemKey(item), -5);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-xs font-bold"
                                  title="Decrease duration by 5s"
                                  aria-label="Decrease duration by 5 seconds"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateDuration(getItemKey(item), -1);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                                  title="Decrease duration by 1s"
                                  aria-label="Decrease duration by 1 second"
                                >
                                  -
                                </button>
                                <span
                                  className="text-xs font-medium min-w-[30px] text-center cursor-help"
                                  title={`Duration: ${item.duration} seconds`}
                                >
                                  {item.duration}s
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateDuration(getItemKey(item), 1);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                                  title="Increase duration by 1s"
                                  aria-label="Increase duration by 1 second"
                                >
                                  +
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateDuration(getItemKey(item), 5);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-xs font-bold"
                                  title="Increase duration by 5s"
                                  aria-label="Increase duration by 5 seconds"
                                >
                                  +5
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div
                    key={`empty-${index}`}
                    className="aspect-[3/4] border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Slot {index + 1}</span>
                  </div>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sortedItems.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          <strong>Playback order:</strong> Items play left to right, top to
          bottom
          {isEditMode && " (drag to reorder)"}
        </div>
      )}
    </div>
  );
};
