// src/features/playlist/components/PlaylistContentsTooltip.tsx

import React, {useEffect, useRef, useState} from 'react';
import {Loader2, X} from 'lucide-react';
import {playlistService} from '../../../services/playlist.service';
import {contentService} from '../../../services/content.service';
import {PlaylistDTO} from '../../../types/models/playlist'; // Assuming a full DTO type

// Define the shape of a content item within the playlist
interface PlaylistItem {
    id: number;
    name: string;
    duration: number; // Duration in this specific playlist
}

interface PlaylistContentsTooltipProps {
    isOpen: boolean;
    playlistId: number | null;
    anchorEl: HTMLElement | null; // The element to position against (the button)
    onClose: () => void;
}

/**
 * A tooltip/popover component that fetches and displays the contents
 * of a specific playlist. It manages its own internal state.
 */
const PlaylistContentsTooltip: React.FC<PlaylistContentsTooltipProps> = ({
                                                                             isOpen,
                                                                             playlistId,
                                                                             anchorEl,
                                                                             onClose,
                                                                         }) => {
    // Internal state for the tooltip's content
    const [playlist, setPlaylist] = useState<PlaylistDTO | null>(null);
    const [items, setItems] = useState<PlaylistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Effect to fetch data when the tooltip is opened with a valid ID
    useEffect(() => {
        if (!isOpen || !playlistId) {
            // Reset state when closed or no ID is provided
            setItems([]);
            setPlaylist(null);
            return;
        }

        const fetchContents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Fetch the playlist details to get its name and content IDs
                const playlistResponse = await playlistService.getPlaylistById(playlistId);
                if (!playlistResponse.success || !playlistResponse.data) {
                    throw new Error(playlistResponse.message || 'Playlist not found.');
                }
                const fetchedPlaylist = playlistResponse.data;
                setPlaylist(fetchedPlaylist);

                // Step 2: Fetch the actual content items using the IDs
                if (fetchedPlaylist.contentIds && fetchedPlaylist.contentIds.length > 0) {
                    const contentResponse = await contentService.getContentsByIds(fetchedPlaylist.contentIds);
                    if (!contentResponse.success) throw new Error(contentResponse.message);

                    const contentMap = new Map(contentResponse.data.map(c => [c.id, c]));
                    const orderedItems = fetchedPlaylist.contentIds
                        .map(id => {
                            const content = contentMap.get(id);
                            return content ? {
                                id: content.id,
                                name: content.name,
                                duration: content.defaultDuration || 10
                            } : null;
                        })
                        .filter((item): item is PlaylistItem => item !== null);

                    setItems(orderedItems);
                } else {
                    setItems([]); // Handle case with no content
                }

            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load playlist contents.';
                setError(message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContents();
    }, [isOpen, playlistId]);

    // Effect to handle clicking outside the tooltip to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen || !anchorEl) return null;

    // Basic positioning logic
    const rect = anchorEl.getBoundingClientRect();
    const style: React.CSSProperties = {
        position: 'fixed',
        top: `${rect.bottom + 8}px`, // Position below the button
        left: `${rect.left}px`, // Align with the left of the button
        zIndex: 1000,
    };

    return (
        <div
            ref={tooltipRef}
            style={style}
            className="w-72 rounded-lg bg-gray-800 text-white shadow-2xl animate-fade-in-down"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-700 p-3">
                <h3 className="truncate text-sm font-semibold">{playlist?.name || 'Loading...'}</h3>
                <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-700">
                    <X size={16}/>
                </button>
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto p-3">
                {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="animate-spin" size={20}/>
                    </div>
                ) : error ? (
                    <div className="p-2 text-center text-sm text-red-400">{error}</div>
                ) : items.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {items.map((item, index) => (
                            <li key={item.id + '-' + index} className="flex justify-between">
                                <span className="truncate pr-4">{item.name}</span>
                                <span className="flex-shrink-0 font-mono text-gray-400">{item.duration}"</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-2 text-center text-sm text-gray-400">This playlist is empty.</div>
                )}
            </div>
        </div>
    );
};

export default PlaylistContentsTooltip;