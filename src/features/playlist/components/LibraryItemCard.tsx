import React from 'react';
import {CheckCircle2} from 'lucide-react';
import {ContentItem} from '../types';

interface LibraryItemCardProps {
    item: ContentItem;
    isSelected: boolean;
    onSelect: (item: ContentItem) => void;
}

const MUSIC_COVER_IMAGE_URL = 'https://placehold.co/400x400/2563eb/white?text=Audio';

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({item, isSelected, onSelect}) => {
    // Use album art as the thumbnail for audio, or placeholder if not available
    // For other types, use the main URL
    const thumbnailUrl = item.type === 'AUDIO'
        ? (item.metadata?.albumArtUrl || MUSIC_COVER_IMAGE_URL)
        : item.url;

    return (
        <div
            onClick={() => onSelect(item)}
            className={`relative aspect-[3/4] border-2 rounded-lg overflow-hidden bg-gray-50 cursor-pointer transition-all group ${
                isSelected
                    ? 'border-green-500 shadow-md'
                    : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
            }`}
        >
            {/* Selected State Checkmark */}
            {isSelected && (
                <div
                    className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-10 shadow-sm"
                    title="This item is in the playlist"
                >
                    <CheckCircle2 className="w-4 h-4"/>
                </div>
            )}

            {/* Dimming Overlay for Selected Items */}
            {isSelected && (
                <div className="absolute inset-0 bg-black bg-opacity-20 z-0"/>
            )}

            <div className="h-full flex flex-col">
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
                            src={thumbnailUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="p-3 bg-white border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700 truncate" title={item.name}>
                        {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {item.type}
                    </p>
                </div>
            </div>
        </div>
    );
};
