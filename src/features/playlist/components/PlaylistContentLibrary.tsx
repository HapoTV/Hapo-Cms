import React, {useState} from 'react';
import {AlertCircle, Clapperboard, ImageIcon, Loader, Music, Search} from 'lucide-react';
import {useContentPagination} from '../../content/hooks/useContentPagination';
import {PaginationControls} from '../../content/components/PaginationControls';
import {ContentItem} from '../types';
import {useMediaPlayerContext} from './MediaPlayerProvider';
import {MediaItem} from './MediaItem';

interface PlaylistContentLibraryProps {
    selectedItemIds: Set<number>;
    onItemSelect: (item: ContentItem) => void;
}

// Define the tabs specifically for playlist creation - consistent with content tabs
const TABS = [
    {id: 'IMAGE', label: 'Images', icon: <ImageIcon size={16}/>},
    {id: 'VIDEO', label: 'Videos', icon: <Clapperboard size={16}/>},
    {id: 'AUDIO', label: 'Audio', icon: <Music size={16}/>},
];

export const PlaylistContentLibrary: React.FC<PlaylistContentLibraryProps> = ({selectedItemIds, onItemSelect}) => {
    const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO' | 'AUDIO'>('IMAGE');

    // Use the media player context
    const {
        currentlyPlaying, isPlaying, handlePlay, handlePause, setSelectedVideo,
        MUSIC_COVER_IMAGE_URL
    } = useMediaPlayerContext();

    // Reuse the master hook from the 'content' feature
    const {
        paginatedItems, isLoading, error, searchQuery,
        setSearchQuery, ...paginationProps
    } = useContentPagination({category: activeTab});

    const renderGrid = () => {
        if (isLoading && paginatedItems.length === 0) {
            return (
                <div className="flex justify-center p-20">
                    <Loader className="animate-spin w-8 h-8 text-blue-500"/>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex justify-center p-20 gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5"/>
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
                {paginatedItems.map((item) => (
                    <MediaItem
                        key={item.id}
                        item={item}
                        isSelected={selectedItemIds.has(item.id as number)}
                        isPlaying={currentlyPlaying?.id === item.id && isPlaying}
                        onSelect={onItemSelect}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onVideoOpen={setSelectedVideo}
                        musicCoverImageUrl={MUSIC_COVER_IMAGE_URL}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add From Library</h2>

            {/* Tab Navigation - Consistent with content library tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'IMAGE' | 'VIDEO' | 'AUDIO')}
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

            {/* Search Input - Consistent with content library search */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder={`Search ${activeTab.toLowerCase()}s...`}
                    className="pl-10 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Content Grid */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
                {renderGrid()}
            </div>

            {/* Pagination - Consistent with content library pagination */}
            <div className="mt-6">
                <PaginationControls
                    currentPage={paginationProps.currentPage}
                    totalPages={paginationProps.totalPages}
                    onPageChange={paginationProps.setCurrentPage}
                    totalItems={paginationProps.totalItems}
                />
            </div>
        </div>
    );
};
