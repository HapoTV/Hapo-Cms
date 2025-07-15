import React, {useCallback, useState} from 'react';
import {CheckCircle2, Pause, PlayCircle} from 'lucide-react';
import {ContentItem} from '../types';

interface MediaItemProps {
    item: ContentItem;
    isSelected?: boolean;
    isPlaying?: boolean;
    onSelect?: (item: ContentItem) => void;
    onPlay?: (item: ContentItem) => void;
    onPause?: () => void;
    onVideoOpen?: (item: ContentItem) => void;
    musicCoverImageUrl: string;
    className?: string;
}

// Double-click timeout in milliseconds
const DOUBLE_CLICK_TIMEOUT = 300;

/**
 * A reusable media item component with double-click detection
 */
export const MediaItem: React.FC<MediaItemProps> = ({
                                                        item,
                                                        isSelected = false,
                                                        isPlaying = false,
                                                        onSelect,
                                                        onPlay,
                                                        onPause,
                                                        onVideoOpen,
                                                        musicCoverImageUrl,
                                                        className = ''
                                                    }) => {
    const [lastClickTime, setLastClickTime] = useState(0);

    // Get the thumbnail URL based on the item type
    const thumbnailUrl = item.type === 'AUDIO'
        ? (item.metadata?.albumArtUrl || musicCoverImageUrl)
        : item.url;

    // Handle click with double-click detection
    const handleClick = useCallback(() => {
        const now = Date.now();
        const isDoubleClick = now - lastClickTime < DOUBLE_CLICK_TIMEOUT;

        if (isDoubleClick) {
            // Handle double-click based on item type
            if (item.type === 'VIDEO' && onVideoOpen) {
                onVideoOpen(item);
            } else if (item.type === 'AUDIO' && onPlay) {
                onPlay(item);
            }
            // Reset click time
            setLastClickTime(0);
        } else {
            // Set the click time for potential double-click detection
            setLastClickTime(now);

            // Capture the current time for comparison in the timeout
            const clickTime = now;

            // Handle single click after a delay to avoid conflicts with double-click
            setTimeout(() => {
                // Check if another click happened after this one
                if (lastClickTime === clickTime && onSelect) {
                    onSelect(item);
                }
            }, DOUBLE_CLICK_TIMEOUT);
        }
    }, [item, lastClickTime, onSelect, onPlay, onVideoOpen]);

    // Handle media controls click (stop propagation to avoid triggering the main click handler)
    const handleMediaControlClick = useCallback((e: React.MouseEvent, callback: () => void) => {
        e.stopPropagation();
        callback();
    }, []);

    return (
        <div
            onClick={handleClick}
            className={`relative group cursor-pointer ${className}`}
        >
            <div
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-colors">
                {item.type === 'VIDEO' ? (
                    <>
                        <video
                            src={`${item.url}#t=0.1`}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                        />
                        <div
                            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => onVideoOpen && handleMediaControlClick(e, () => onVideoOpen(item))}
                        >
                            <PlayCircle className="w-16 h-16 text-white/80"/>
                        </div>
                    </>
                ) : item.type === 'AUDIO' ? (
                    <>
                        <img
                            src={thumbnailUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isPlaying && onPause) {
                                    onPause();
                                } else if (onPlay) {
                                    onPlay(item);
                                }
                            }}
                        >
                            {isPlaying ? (
                                <Pause size={32} className="text-white"/>
                            ) : (
                                <PlayCircle size={32} className="text-white"/>
                            )}
                        </div>
                    </>
                ) : (
                    <img
                        src={thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Selection overlay */}
                {isSelected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-green-500 text-white rounded-full p-2">
                            <CheckCircle2 className="w-6 h-6"/>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-2">
                <p className="font-medium text-sm text-gray-800 truncate" title={item.name}>
                    {item.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {item.type}
                </p>
            </div>
        </div>
    );
};
