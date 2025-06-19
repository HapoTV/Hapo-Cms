import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Loader, AlertCircle, PlayCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../../../services/content.service';
import { ContentItem } from '../../../types/models/ContentItem';

const Videos: React.FC = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [videoContent, setVideoContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // --- NEW: State for the Video Player Modal ---
    const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await contentService.getContentByCategory('VIDEO');
                setVideoContent(data);
            } catch (err) {
                setError('Failed to fetch video content. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideos();
    }, []);

    // --- Client-Side Filtering ---
    const filteredVideos = useMemo(() => {
        if (!searchQuery) return videoContent;
        return Array.isArray(videoContent)
            ? videoContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];
    }, [videoContent, searchQuery]);

    // --- NEW: Grid Renderer ---
    const renderContentGrid = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <Loader className="animate-spin w-8 h-8 text-gray-500" />
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex justify-center items-center p-20 gap-2 text-red-600">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            );
        }
        if (filteredVideos.length === 0) {
            return <div className="text-center p-20 text-gray-500">No videos found.</div>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredVideos.map(video => (
                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative aspect-video bg-black">
                            {/* Use the video tag itself for the thumbnail. preload="metadata" helps load the first frame. */}
                            <video
                                src={`${video.url}#t=0.1`} // Appending #t=0.1 helps browsers show the first frame
                                className="w-full h-full object-cover"
                                preload="metadata"
                                muted
                                playsInline
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircle className="w-16 h-16 text-white text-opacity-80" />
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-semibold text-gray-800 truncate" title={video.name}>{video.name}</p>
                            <p className="text-sm text-gray-500">{video.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
                <button
                    onClick={() => navigate('/content/upload')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />Add Video
                </button>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Render the Grid */}
            {renderContentGrid()}

            {/* --- NEW: Video Player Modal --- */}
            {selectedVideo && (
                <div
                    onClick={() => setSelectedVideo(null)}
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
                        className="relative bg-black rounded-lg shadow-2xl w-full max-w-4xl"
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-3 -right-3 bg-white rounded-full p-1 z-10 text-gray-700 hover:text-black"
                        >
                            <X size={24}/>
                        </button>
                        <video
                            src={selectedVideo.url}
                            className="w-full h-auto max-h-[85vh] rounded-lg"
                            controls
                            autoPlay
                        />
                        <div className="p-4 bg-white rounded-b-lg">
                           <h3 className="text-lg font-semibold text-gray-900">{selectedVideo.name}</h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Videos;