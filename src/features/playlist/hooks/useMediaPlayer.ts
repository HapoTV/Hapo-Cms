import {useCallback, useEffect, useRef, useState} from 'react';
import {ContentItem} from '../../../types/models/ContentItem';

// Constants
const MUSIC_COVER_IMAGE_URL = 'https://placehold.co/400x400/2563eb/white?text=Audio';
const DOUBLE_CLICK_TIMEOUT = 300; // ms

/**
 * Custom hook for media playback
 * Provides functions and state for playing audio and video content
 */
export const useMediaPlayer = () => {
    // Media player state
    const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<ContentItem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Double-click handling
    const [lastClickedItem, setLastClickedItem] = useState<{ item: ContentItem, time: number } | null>(null);

    // Effect to control the audio element based on player state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [isPlaying, currentlyPlaying]);

    // Player handlers
    const handlePlay = useCallback((track: ContentItem) => {
        if (currentlyPlaying?.id !== track.id) setCurrentTime(0);
        setCurrentlyPlaying(track);
        setIsPlaying(true);
    }, [currentlyPlaying]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const handleStop = useCallback(() => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
    }, []);

    const handlePlayNextPrev = useCallback((direction: 'next' | 'prev', items: ContentItem[]) => {
        if (!currentlyPlaying || items.length < 2) return;
        const currentIndex = items.findIndex(item => item.id === currentlyPlaying.id);
        if (currentIndex === -1) return;

        const offset = direction === 'next' ? 1 : -1;
        const nextIndex = (currentIndex + offset + items.length) % items.length;
        handlePlay(items[nextIndex]);
    }, [currentlyPlaying, handlePlay]);

    // Handle item click with double-click detection
    const handleItemClick = useCallback((item: ContentItem, onSingleClick?: (item: ContentItem) => void) => {
        const now = Date.now();

        if (lastClickedItem && lastClickedItem.item.id === item.id && now - lastClickedItem.time < DOUBLE_CLICK_TIMEOUT) {
            // Double click detected
            if (item.type === 'VIDEO') {
                setSelectedVideo(item);
            } else if (item.type === 'AUDIO') {
                handlePlay(item);
            } else if (item.type === 'IMAGE') {
                // For images, we could implement a lightbox/fullscreen view here
                console.log('Image double-clicked:', item);
            }
            setLastClickedItem(null);
        } else {
            // Single click
            setLastClickedItem({item, time: now});

            // Execute the single click handler after a short delay
            setTimeout(() => {
                if (lastClickedItem && lastClickedItem.item.id === item.id && now - lastClickedItem.time >= DOUBLE_CLICK_TIMEOUT) {
                    onSingleClick?.(item);
                }
            }, DOUBLE_CLICK_TIMEOUT);
        }
    }, [lastClickedItem, handlePlay]);

    // Format time helper
    const formatTime = useCallback((time: number) => {
        return new Date(time * 1000).toISOString().substr(14, 5);
    }, []);

    return {
        // State
        selectedVideo,
        currentlyPlaying,
        isPlaying,
        currentTime,
        duration,
        audioRef,

        // Actions
        setSelectedVideo,
        setCurrentlyPlaying,
        setIsPlaying,
        setCurrentTime,
        setDuration,

        // Handlers
        handlePlay,
        handlePause,
        handleStop,
        handlePlayNextPrev,
        handleItemClick,

        // Helpers
        formatTime,
        MUSIC_COVER_IMAGE_URL
    };
};