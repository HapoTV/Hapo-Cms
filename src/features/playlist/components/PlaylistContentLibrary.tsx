import React, {useState} from 'react';
import {AlertCircle, Clapperboard, ImageIcon, Loader, Music, Search} from 'lucide-react';
import {useContentPagination} from '../../content/hooks/useContentPagination';
import {PaginationControls} from '../../content/components/PaginationControls';
import {LibraryItemCard} from './LibraryItemCard';
import {ContentItem} from '../../../types/models/ContentItem';

interface PlaylistContentLibraryProps {
    selectedItemIds: Set<number>;
    onItemSelect: (item: ContentItem) => void;
}

// Define the tabs specifically for playlist creation
const TABS = [
    {id: 'IMAGE', label: 'Images', icon: <ImageIcon size={16}/>},
    {id: 'VIDEO', label: 'Videos', icon: <Clapperboard size={16}/>},
    {id: 'AUDIO', label: 'Audio', icon: <Music size={16}/>},
];

export const PlaylistContentLibrary: React.FC<PlaylistContentLibraryProps> = ({selectedItemIds, onItemSelect}) => {
    const [activeTab, setActiveTab] = useState<'IMAGE' | 'VIDEO' | 'AUDIO'>('IMAGE');

    // Reuse the master hook from the 'content' feature
    const {
        paginatedItems, isLoading, error, searchQuery,
        setSearchQuery, ...paginationProps
    } = useContentPagination({category: activeTab});

    const renderGrid = () => {
        if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin w-8 h-8"/>
        </div>;
        if (error) return <div className="flex justify-center p-10 text-red-500"><AlertCircle className="mr-2"/>{error}
        </div>;
        if (paginatedItems.length === 0) return <div
            className="text-center p-10 text-gray-500">No {activeTab.toLowerCase()} content found.</div>;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {paginatedItems.map((item) => (
                    <LibraryItemCard
                        key={item.id}
                        item={item}
                        isSelected={selectedItemIds.has(item.id)}
                        onSelect={onItemSelect}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add From Library</h2>

            <div className="flex border-b border-gray-200 mb-4">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 capitalize px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}{tab.label}
                    </button>
                ))}
            </div>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder={`Search ${activeTab.toLowerCase()}s...`}
                    className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
                {renderGrid()}
            </div>
            <PaginationControls
                currentPage={paginationProps.currentPage}
                totalPages={paginationProps.totalPages}
                onPageChange={paginationProps.setCurrentPage}
                totalItems={paginationProps.totalItems}
            />
        </div>
    );
};