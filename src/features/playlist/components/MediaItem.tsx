import React, {useCallback, useState, useEffect} from 'react';
import {CheckCircle2, Pause, PlayCircle, Music, Image, Video, FileAudio} from 'lucide-react';
import {ContentItem} from '../types';

interface MediaItemProps {
    item: ContentItem | any;
    isSelected?: boolean;
    isPlaying?: boolean;
    onSelect?: (item: any) => void;
    onPlay?: (item: any) => void;
    onPause?: () => void;
    onVideoOpen?: (item: any) => void;
    musicCoverImageUrl: string;
    className?: string;
    isSpotify?: boolean;
}

const DOUBLE_CLICK_TIMEOUT = 300;

export const MediaItem: React.FC<MediaItemProps> = ({
    item,
    isSelected = false,
    isPlaying = false,
    onSelect,
    onPlay,
    onPause,
    onVideoOpen,
    musicCoverImageUrl,
    className = '',
    isSpotify = false
}) => {
    const [lastClickTime, setLastClickTime] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [fetchedMediaUrl, setFetchedMediaUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Determine if this is a Spotify item
    const isSpotifyItem = isSpotify || item.type === 'spotify' || item.spotifyId;
    
    // Determine content type for proper rendering
    const getContentType = () => {
        if (isSpotifyItem) return 'SPOTIFY';
        if (item.type) return item.type; // 'content' or specific type
        if (item.contentType) return item.contentType; // 'JPEG', 'MOV', etc.
        return 'UNKNOWN';
    };

    const contentType = getContentType();

    // Fetch content URL from API when component mounts for non-Spotify items without URL
    useEffect(() => {
        const fetchContentUrl = async () => {
            // Only fetch if it's a non-Spotify item that doesn't have a URL but has name and contentId
            if (!isSpotifyItem && !item.url && item.name && item.contentId && !fetchedMediaUrl) {
                setIsLoading(true);
                try {
                    const response = await fetch(`/api/content/url-by-name-id?name=${encodeURIComponent(item.name)}&contentId=${item.contentId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.data) {
                            setFetchedMediaUrl(data.data);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch content URL:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchContentUrl();
    }, [isSpotifyItem, item.url, item.name, item.contentId, fetchedMediaUrl]);

    // Get the URL for the media - handle both ContentItem and playlist item formats
    const getMediaUrl = () => {
        if (isSpotifyItem) {
            return item.preview_url || null; // Use Spotify preview if available
        }
        
        // For ContentItem objects (from library), use the url property
        if (item.url) {
            return item.url;
        }
        
        // Use fetched URL from API if available
        if (fetchedMediaUrl) {
            return fetchedMediaUrl;
        }
        
        // For playlist items without url, construct from contentId as fallback
        if (item.contentId) {
            return `/api/content/${item.contentId}`;
        }
        
        return null;
    };

    // Get the appropriate thumbnail URL based on content type
    const getThumbnailUrl = () => {
        switch (contentType) {
            case 'SPOTIFY':
                return item.thumbnailUrl || item.album?.images?.[0]?.url || musicCoverImageUrl;
            
            case 'AUDIO':
            case 'MP3':
            case 'WAV':
            case 'M4A':
                // For audio files, use album art if available, otherwise default cover
                return item.metadata?.albumArtUrl || musicCoverImageUrl;
            
            case 'IMAGE':
            case 'JPEG':
            case 'PNG':
            case 'GIF':
            case 'WEBP':
                // For images, use thumbnail URL if available, otherwise use media URL
                if (item.thumbnailUrl) return item.thumbnailUrl;
                if (item.url) return item.url; // For ContentItem objects
                if (fetchedMediaUrl) return fetchedMediaUrl; // Use fetched URL
                if (item.contentId) return `/api/content/${item.contentId}/thumbnail`;
                return musicCoverImageUrl;
            
            case 'VIDEO':
            case 'MOV':
            case 'MP4':
            case 'AVI':
                // For videos, use thumbnail URL if available, otherwise use media URL
                if (item.thumbnailUrl) return item.thumbnailUrl;
                if (item.url) return item.url; // For ContentItem objects
                if (fetchedMediaUrl) return fetchedMediaUrl; // Use fetched URL
                if (item.contentId) return `/api/content/${item.contentId}/thumbnail`;
                return musicCoverImageUrl;
            
            default:
                return musicCoverImageUrl;
        }
    };

    const mediaUrl = getMediaUrl();
    const thumbnailUrl = getThumbnailUrl();
    const displayName = item.name || 'Untitled';

    const handleClick = useCallback(() => {
        const now = Date.now();
        const isDoubleClick = now - lastClickTime < DOUBLE_CLICK_TIMEOUT;

        if (isDoubleClick) {
            if ((contentType === 'VIDEO' || contentType === 'MOV' || contentType === 'MP4') && onVideoOpen && mediaUrl) {
                onVideoOpen({...item, url: mediaUrl});
            } else if (onPlay) {
                onPlay(item);
            }
            setLastClickTime(0);
        } else {
            setLastClickTime(now);
            const clickTime = now;

            setTimeout(() => {
                if (lastClickTime === clickTime && onSelect) {
                    onSelect(item);
                }
            }, DOUBLE_CLICK_TIMEOUT);
        }
    }, [item, lastClickTime, onSelect, onPlay, onVideoOpen, contentType, mediaUrl]);

    const handleMediaControlClick = useCallback((e: React.MouseEvent, callback: () => void) => {
        e.stopPropagation();
        callback();
    }, []);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    // Get appropriate icon for the content type
    const getContentIcon = () => {
        switch (contentType) {
            case 'IMAGE':
            case 'JPEG':
            case 'PNG':
            case 'GIF':
            case 'WEBP':
                return <Image className="w-4 h-4" />;
            case 'VIDEO':
            case 'MOV':
            case 'MP4':
            case 'AVI':
                return <Video className="w-4 h-4" />;
            case 'AUDIO':
            case 'MP3':
            case 'WAV':
            case 'M4A':
                return <FileAudio className="w-4 h-4" />;
            case 'SPOTIFY':
                return <Music className="w-4 h-4" />;
            default:
                return null;
        }
    };

    // Get content type label for display
    const getContentTypeLabel = () => {
        switch (contentType) {
            case 'SPOTIFY':
                return 'Spotify';
            case 'IMAGE':
            case 'JPEG':
            case 'PNG':
            case 'GIF':
            case 'WEBP':
                return 'Image';
            case 'VIDEO':
            case 'MOV':
            case 'MP4':
            case 'AVI':
                return 'Video';
            case 'AUDIO':
            case 'MP3':
            case 'WAV':
            case 'M4A':
                return 'Audio';
            default:
                return 'File';
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`relative group cursor-pointer ${className}`}
        >
            <div className="w-full h-full min-h-[80px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-blue-400 transition-colors">
                {(contentType === 'VIDEO' || contentType === 'MOV' || contentType === 'MP4') ? (
                    <>
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            {isLoading ? (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : mediaUrl ? (
                                <video
                                    src={`${mediaUrl}#t=0.1`}
                                    className="w-full h-full object-contain"
                                    preload="metadata"
                                    muted
                                    playsInline
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-gray-500" />
                                </div>
                            )}
                            <div
                                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => onVideoOpen && handleMediaControlClick(e, () => onVideoOpen({...item, url: mediaUrl}))}
                            >
                                <PlayCircle className="w-8 h-8 text-white/80"/>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            {isLoading ? (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <img
                                    src={imageError ? musicCoverImageUrl : thumbnailUrl}
                                    alt={displayName}
                                    className="w-full h-full object-contain"
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            )}
                            {(contentType === 'AUDIO' || contentType === 'MP3' || contentType === 'WAV' || contentType === 'M4A' || contentType === 'SPOTIFY') && (
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
                                        <Pause size={24} className="text-white"/>
                                    ) : (
                                        <PlayCircle size={24} className="text-white"/>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Content type badge overlay */}
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1 flex items-center justify-center">
                    {getContentIcon()}
                </div>

                {isSelected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-green-500 text-white rounded-full p-1">
                            <CheckCircle2 className="w-4 h-4"/>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-1 p-1">
                <p className="font-medium text-xs text-gray-800 truncate" title={displayName}>
                    {displayName}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                    {getContentTypeLabel()}
                    {isSpotifyItem && item.artists && (
                        <> • {item.artists.map((a: any) => a.name).join(', ')}</>
                    )}
                </p>
            </div>
        </div>
    );
};
