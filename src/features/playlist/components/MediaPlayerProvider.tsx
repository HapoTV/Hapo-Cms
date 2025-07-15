import React, {createContext, ReactNode, useContext} from 'react';
import {ContentItem} from '../types';
import {useMediaPlayer} from '../hooks/useMediaPlayer';
import {AudioPlayer} from './AudioPlayer';
import {VideoPlayer} from './VideoPlayer';

// Create a context for the media player
interface MediaPlayerContextType {
    selectedVideo: ContentItem | null;
    currentlyPlaying: ContentItem | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    setSelectedVideo: (video: ContentItem | null) => void;
    handlePlay: (item: ContentItem) => void;
    handlePause: () => void;
    handleStop: () => void;
    handlePlayNextPrev: (direction: 'next' | 'prev', items: ContentItem[]) => void;
    formatTime: (time: number) => string;
    MUSIC_COVER_IMAGE_URL: string;
}

const MediaPlayerContext = createContext<MediaPlayerContextType | null>(null);

// Custom hook to use the media player context
export const useMediaPlayerContext = () => {
    const context = useContext(MediaPlayerContext);
    if (!context) {
        throw new Error('useMediaPlayerContext must be used within a MediaPlayerProvider');
    }
    return context;
};

interface MediaPlayerProviderProps {
    children: ReactNode;
}

/**
 * Provider component that manages media player state and renders audio/video players
 */
export const MediaPlayerProvider: React.FC<MediaPlayerProviderProps> = ({children}) => {
    // Use the media player hook
    const {
        selectedVideo, currentlyPlaying, isPlaying, currentTime, duration, audioRef,
        setSelectedVideo, handlePlay, handlePause, handleStop, handlePlayNextPrev, formatTime,
        MUSIC_COVER_IMAGE_URL
    } = useMediaPlayer();

    // Create the context value
    const contextValue: MediaPlayerContextType = {
        selectedVideo,
        currentlyPlaying,
        isPlaying,
        currentTime,
        duration,
        setSelectedVideo,
        handlePlay,
        handlePause,
        handleStop,
        handlePlayNextPrev,
        formatTime,
        MUSIC_COVER_IMAGE_URL
    };

    return (
        <MediaPlayerContext.Provider value={contextValue}>
            {children}

            {/* Persistent Audio Player */}
            <AudioPlayer
                currentlyPlaying={currentlyPlaying}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                audioRef={audioRef}
                onPlayPause={() => isPlaying ? handlePause() : (currentlyPlaying && handlePlay(currentlyPlaying))}
                onStop={handleStop}
                onNext={() => currentlyPlaying && handlePlayNextPrev('next', [currentlyPlaying])}
                onPrev={() => currentlyPlaying && handlePlayNextPrev('prev', [currentlyPlaying])}
                onTimeChange={(time) => {
                    if (audioRef.current) {
                        audioRef.current.currentTime = time;
                    }
                }}
                formatTime={formatTime}
                musicCoverImageUrl={MUSIC_COVER_IMAGE_URL}
            />

            {/* Modal Video Player */}
            <VideoPlayer
                selectedVideo={selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </MediaPlayerContext.Provider>
    );
};
