import React, { useState } from 'react';
import {
  AlertCircle,
  Clapperboard,
  ImageIcon,
  Loader,
  Music,
  Search,
  X,
} from 'lucide-react';
import { useContentPagination } from '../../content/hooks/useContentPagination';
import { PaginationControls } from '../../content/components/PaginationControls';
import { ContentItem } from '../types';
import { useMediaPlayerContext } from './MediaPlayerProvider';

interface PlaylistContentLibraryProps {
  selectedItemIds: Set<string>; // Updated to handle UUIDs
  onItemSelect: (item: ContentItem, duration?: number) => void;
}

// Tabs for images, videos, audio
const TABS = [
  { id: 'IMAGE', label: 'Images', icon: <ImageIcon size={16} /> },
  { id: 'VIDEO', label: 'Videos', icon: <Clapperboard size={16} /> },
  { id: 'AUDIO', label: 'Audio', icon: <Music size={16} /> },
];

export const PlaylistContentLibrary: React.FC<
  PlaylistContentLibraryProps
> = ({ selectedItemIds, onItemSelect }) => {
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO' | 'AUDIO'>(
    'IMAGE'
  );
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);

  // MediaPlayer context
  const { setSelectedVideo: setContextSelectedVideo, MUSIC_COVER_IMAGE_URL } =
    useMediaPlayerContext();

  // Pagination hook reused from content feature
  const {
    paginatedItems,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    ...paginationProps
  } = useContentPagination({ category: activeTab });

  // Handle video selection for preview
  const handleVideoOpen = (video: ContentItem) => {
    setSelectedVideo(video);
    setContextSelectedVideo(video);
  };

  const renderVideoThumbnail = (video: ContentItem) => (
    <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden group cursor-pointer">
      <video
        src={`${video.url}#t=0.1`}
        className="w-full h-full object-cover"
        preload="metadata"
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Clapperboard className="w-8 h-8 text-white/80" />
      </div>
    </div>
  );

  // Add-to-playlist button
  const renderAddButton = (item: ContentItem) => {
    const isSelected = selectedItemIds.has(item.id as string);

    return (
      <button
        onClick={() => onItemSelect(item)}
        disabled={isSelected}
        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
          isSelected
            ? 'bg-green-500 text-white cursor-default'
            : 'bg-white/70 hover:bg-white hover:scale-110'
        }`}
        title={isSelected ? 'Already in playlist' : 'Add to playlist'}
      >
        {isSelected ? '✓' : '+'}
      </button>
    );
  };

  const renderImageItem = (item: ContentItem) => (
    <div
      key={item.id}
      className="relative bg-white rounded-lg shadow-md border group"
    >
      <div className="cursor-pointer">
        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={item.thumbnailUrl || item.url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
            }}
          />
        </div>
        <div className="p-3">
          <p
            className="font-semibold text-gray-800 truncate text-sm"
            title={item.name}
          >
            {item.name}
          </p>
        </div>
      </div>
      {renderAddButton(item)}
    </div>
  );

  const renderAudioItem = (item: ContentItem) => (
    <div
      key={item.id}
      className="relative bg-white rounded-lg shadow-md border group"
    >
      <div className="cursor-pointer">
        <div className="aspect-square bg-gray-900 rounded-t-lg overflow-hidden flex items-center justify-center">
          <img
            src={item.thumbnailUrl || MUSIC_COVER_IMAGE_URL}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = MUSIC_COVER_IMAGE_URL;
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music className="w-8 h-8 text-white/80" />
          </div>
        </div>
        <div className="p-3">
          <p
            className="font-semibold text-gray-800 truncate text-sm"
            title={item.name}
          >
            {item.name}
          </p>
        </div>
      </div>
      {renderAddButton(item)}
    </div>
  );

  const renderVideoItem = (item: ContentItem) => (
    <div
      key={item.id}
      className="relative bg-white rounded-lg shadow-md border group"
    >
      <div onClick={() => handleVideoOpen(item)} className="cursor-pointer">
        {renderVideoThumbnail(item)}
        <div className="p-3">
          <p
            className="font-semibold text-gray-800 truncate text-sm"
            title={item.name}
          >
            {item.name}
          </p>
        </div>
      </div>
      {renderAddButton(item)}
    </div>
  );

  const renderGrid = () => {
    if (isLoading && paginatedItems.length === 0) {
      return (
        <div className="flex justify-center p-20">
          <Loader className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center p-20 gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      );
    }
    if (paginatedItems.length === 0) {
      return (
        <div className="text-center p-20 text-gray-500">
          No {activeTab.toLowerCase()} content found.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {paginatedItems.map((item) => {
          switch (activeTab) {
            case 'IMAGE':
              return renderImageItem(item);
            case 'AUDIO':
              return renderAudioItem(item);
            case 'VIDEO':
              return renderVideoItem(item);
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Add From Library
      </h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as 'IMAGE' | 'VIDEO' | 'AUDIO')
              }
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}s...`}
          className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="max-h-[60vh] overflow-y-auto pr-2">{renderGrid()}</div>

      {/* Pagination */}
      <div className="mt-6">
        <PaginationControls
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.setCurrentPage}
          totalItems={paginationProps.totalItems}
        />
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          onClick={() => {
            setSelectedVideo(null);
            setContextSelectedVideo(null);
          }}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black rounded-lg w-full max-w-4xl"
          >
            <button
              onClick={() => {
                setSelectedVideo(null);
                setContextSelectedVideo(null);
              }}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 z-10"
            >
              <X size={24} />
            </button>
            <video
              src={selectedVideo.url}
              className="w-full max-h-[85vh] rounded-lg"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </div>
  );
};
