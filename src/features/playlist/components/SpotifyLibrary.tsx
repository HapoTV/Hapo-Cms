// src/features/playlist/components/SpotifyLibrary.tsx
import React, { useState } from 'react';
import { AlertCircle, Loader, Search, X, Play, Plus, ExternalLink } from 'lucide-react';
import { spotifyService } from '../../../services/spotify.service';
import { SpotifyTrack } from '../../../types/models/Spotify';
import { toast } from 'react-toastify';

interface SpotifyLibraryProps {
    selectedItemIds: Set<number>;
    onItemSelect: (item: SpotifyTrack) => void;
}

export const SpotifyLibrary: React.FC<SpotifyLibraryProps> = ({ 
    selectedItemIds, 
    onItemSelect 
}) => {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = async (page: number = 1) => {
        if (!searchQuery.trim()) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const results = await spotifyService.searchTracks(searchQuery, 18);
            setTracks(results);
            setCurrentPage(page);
        } catch (error) {
            console.error('Spotify search failed:', error);
            setError('Failed to search Spotify. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setTracks([]);
        setError(null);
        setCurrentPage(1);
        setPlayingTrackId(null);
    };

    const handlePlayPreview = (track: SpotifyTrack, event: React.MouseEvent) => {
        event.stopPropagation();
        
        if (playingTrackId === track.id) {
            setPlayingTrackId(null);
        } else {
            setPlayingTrackId(track.id);
            if (track.preview_url) {
                const audio = new Audio(track.preview_url);
                audio.play().catch(error => {
                    console.error('Failed to play preview:', error);
                    toast.error('Preview not available for this track');
                });
                setTimeout(() => setPlayingTrackId(null), 30000);
            }
        }
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderGrid = () => {
        if (isLoading && tracks.length === 0) {
            return (
                <div className="flex justify-center p-20">
                    <Loader className="animate-spin w-8 h-8 text-green-500"/>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex justify-center p-20 gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5"/>
                    <span>{error}</span>
                </div>
            );
        }
        if (tracks.length === 0 && searchQuery) {
            return (
                <div className="text-center p-20 text-gray-500">
                    No tracks found for "{searchQuery}".
                </div>
            );
        }
        if (tracks.length === 0) {
            return (
                <div className="text-center p-20 text-gray-500">
                    Search for music on Spotify to add to your playlist.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {tracks.map((track) => {
                    const isSelected = Array.from(selectedItemIds).some(id => 
                        id.toString() === track.id || id === parseInt(track.id)
                    );
                    
                    return (
                        <div key={track.id} className="relative group bg-white rounded-lg p-3 border hover:shadow-md transition-shadow">
                            <img
                                src={track.album.images[0]?.url}
                                alt={track.album.name}
                                className="w-full aspect-square object-cover rounded-md mb-2"
                            />
                            
                            <div className="text-sm font-medium truncate">{track.name}</div>
                            <div className="text-xs text-gray-600 truncate mb-1">
                                {track.artists.map(artist => artist.name).join(', ')}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {track.album.name}
                            </div>
                            <div className="text-xs text-gray-400">
                                {formatDuration(track.duration_ms)}
                            </div>

                            {/* Spotify badge */}
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                Spotify
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    Added
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {track.preview_url && (
                                    <button
                                        onClick={(e) => handlePlayPreview(track, e)}
                                        className="p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        title={playingTrackId === track.id ? 'Stop preview' : 'Play preview'}
                                    >
                                        <Play 
                                            size={12} 
                                            className={playingTrackId === track.id ? 'text-orange-400' : ''}
                                        />
                                    </button>
                                )}
                                
                                <a
                                    href={track.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                    title="Open in Spotify"
                                >
                                    <ExternalLink size={12} />
                                </a>
                                
                                <button
                                    onClick={() => onItemSelect(track)}
                                    disabled={isSelected}
                                    className="p-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                                    title={isSelected ? 'Already added' : 'Add to playlist'}
                                >
                                    <Plus size={12} />
                                </button>
                            </div>

                            {/* Preview availability indicator */}
                            {!track.preview_url && (
                                <div className="absolute bottom-2 left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                                    No Preview
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            {/* Search Input */}
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    placeholder="Search for songs on Spotify..."
                    className="pl-10 pr-10 w-full rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 px-3 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                />
                {searchQuery && (
                    <X 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer hover:text-gray-600"
                        onClick={clearSearch}
                    />
                )}
            </div>

            {/* Search Button */}
            <div className="mb-6">
                <button
                    onClick={() => handleSearch(1)}
                    disabled={isLoading || !searchQuery.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search size={16} />}
                    {isLoading ? 'Searching...' : 'Search Spotify'}
                </button>
            </div>

            {/* Info message about previews */}
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                <p>💡 Spotify provides 30-second previews. Full tracks require Spotify Premium.</p>
            </div>

            {/* Content Grid */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
                {renderGrid()}
            </div>
        </div>
    );
};