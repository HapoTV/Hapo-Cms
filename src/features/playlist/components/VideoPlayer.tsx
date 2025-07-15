import React from 'react';
import {X} from 'lucide-react';
import {ContentItem} from '../types';

interface VideoPlayerProps {
    selectedVideo: ContentItem | null;
    onClose: () => void;
}

/**
 * A reusable video player component
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
                                                            selectedVideo,
                                                            onClose
                                                        }) => {
    if (!selectedVideo) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-black rounded-lg w-full max-w-4xl"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 z-10 hover:bg-gray-100 transition-colors focus:outline-none"
                >
                    <X size={24}/>
                </button>
                <video
                    src={selectedVideo.url}
                    className="w-full max-h-[85vh] rounded-lg"
                    controls
                    autoPlay
                />
            </div>
        </div>
    );
};
