import React from 'react';
import {Pause, PlayCircle, SkipBack, SkipForward, X} from 'lucide-react';
import {ContentItem} from '../types';

interface AudioPlayerProps {
    currentlyPlaying: ContentItem | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement>;
    onPlayPause: () => void;
    onStop: () => void;
    onNext: () => void;
    onPrev: () => void;
    onTimeChange: (time: number) => void;
    formatTime: (time: number) => string;
    musicCoverImageUrl: string;
}

/**
 * A reusable audio player component
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
                                                            currentlyPlaying,
                                                            isPlaying,
                                                            currentTime,
                                                            duration,
                                                            audioRef,
                                                            onPlayPause,
                                                            onStop,
                                                            onNext,
                                                            onPrev,
                                                            onTimeChange,
                                                            formatTime,
                                                            musicCoverImageUrl
                                                        }) => {
    if (!currentlyPlaying) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-4 z-40">
            <audio
                ref={audioRef}
                src={currentlyPlaying.url}
            />
            <img
                src={currentlyPlaying.metadata?.albumArtUrl || musicCoverImageUrl}
                alt={currentlyPlaying.name}
                className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-grow flex items-center justify-center gap-4">
                <button onClick={onPrev} className="focus:outline-none hover:text-blue-600 transition-colors">
                    <SkipBack size={24}/>
                </button>
                <button
                    onClick={onPlayPause}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none"
                >
                    {isPlaying ? <Pause size={28}/> : <PlayCircle size={28}/>}
                </button>
                <button onClick={onNext} className="focus:outline-none hover:text-blue-600 transition-colors">
                    <SkipForward size={24}/>
                </button>
            </div>
            <div className="flex-grow items-center gap-2 w-full max-w-md hidden md:flex">
                <span className="text-sm">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={e => onTimeChange(Number(e.target.value))}
                    className="w-full accent-blue-600"
                />
                <span className="text-sm">{formatTime(duration)}</span>
            </div>
            <button
                onClick={onStop}
                className="focus:outline-none hover:text-red-600 transition-colors"
            >
                <X size={24}/>
            </button>
        </div>
    );
};
