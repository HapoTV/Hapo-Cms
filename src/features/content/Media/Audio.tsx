import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MoreVertical, Plus, Loader, AlertCircle, PlayCircle, Pause, X, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../../../services/content.service';

// --- MODIFIED: The ContentItem type should optionally include a thumbnailUrl ---
// For example:
// export interface ContentItem {
//   id: string;
//   name: string;
//   url: string;
//   thumbnailUrl?: string; // <--- ADD THIS PROPERTY
//   uploadDate?: string;
//   tags?: string[];
//   type?: string;
// }
import { ContentItem } from '../../../types/models/ContentItem';
// --- NEW: Importing the DropdownMenu component ---
import { DropdownMenu } from '../components/DropdownMenu';


// --- Helper functions ---
const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MUSIC_COVER_IMAGE_URL = 'https://african-arts-and-crafts-bucket.s3.eu-north-1.amazonaws.com/60320693-782c-4b22-8ea4-6d188f9c0301.jpg';

const Audio: React.FC = () => {
    const navigate = useNavigate();

    // --- State Management ---
    const [audioContent, setAudioContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    // --- NEW: State to manage which dropdown menu is open ---
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);


    // --- Audio Player State ---
    const [currentlyPlaying, setCurrentlyPlaying] = useState<ContentItem | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchAudio = async () => {
            try {
                // To demonstrate thumbnails, you could mock data like this:
                // const data = (await contentService.getContentByCategory('AUDIO')).map((item, index) => ({
                //     ...item,
                //     // Add a thumbnail to every second item for testing
                //     thumbnailUrl: index % 2 === 0 ? `https://picsum.photos/seed/${item.id}/200` : undefined
                // }));
                const data = await contentService.getContentByCategory('AUDIO');
                setAudioContent(data);
            } catch (err) {
                setError('Failed to fetch audio content. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAudio();
    }, []);

    // --- Effect to control the audio element ---
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audio.pause();
            }
        }
    }, [isPlaying, currentlyPlaying]);

    // --- NEW: Effect to close dropdown when clicking outside ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && !(event.target as Element).closest(`[data-dropdown-container="${openDropdownId}"]`)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    // --- Client-Side Filtering ---
    const filteredAudio = useMemo(() => {
        if (!searchQuery) return audioContent;
        return Array.isArray(audioContent)
            ? audioContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];
    }, [audioContent, searchQuery]);

    // --- Audio Player Handlers ---
    const handlePlayClick = (track: ContentItem) => {
        // If it's a new track, reset the times to avoid a flicker of old data
        if (currentlyPlaying?.id !== track.id) {
            setCurrentTime(0);
            setDuration(0);
        }
        setCurrentlyPlaying(track);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (!currentlyPlaying) return;
        setIsPlaying(!isPlaying);
    };

    const closePlayer = () => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
    };

    // --- NEW: Handler to remove a deleted item from the state ---
    // NOTE: Assumes ContentItem 'id' is a string. If it's a number, change the type here.
    const handleDeleteItem = (idToDelete: number) => {
        setAudioContent(prevContent => prevContent.filter(item => item.id !== idToDelete));
        if (currentlyPlaying?.id === idToDelete) {
            closePlayer();
        }
        setOpenDropdownId(null); // Close the dropdown after deletion
    };

    // --- Next/Previous and Auto-Play Logic ---
    const handlePlayNext = () => {
        if (!currentlyPlaying || filteredAudio.length < 2) return;
        const currentIndex = filteredAudio.findIndex(track => track.id === currentlyPlaying.id);
        const nextIndex = (currentIndex + 1) % filteredAudio.length;
        handlePlayClick(filteredAudio[nextIndex]);
    };

    const handlePlayPrevious = () => {
        if (!currentlyPlaying || filteredAudio.length < 2) return;
        const currentIndex = filteredAudio.findIndex(track => track.id === currentlyPlaying.id);
        const prevIndex = (currentIndex - 1 + filteredAudio.length) % filteredAudio.length;
        handlePlayClick(filteredAudio[prevIndex]);
    };

    const handleTrackEnd = () => handlePlayNext();

    // --- NEW: Handler for the progress slider ---
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = Number(e.target.value);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    // --- MODIFIED & CORRECTED RENDER FUNCTION ---
    const renderGridView = () => {
        if (isLoading) { return <div className="col-span-full text-center p-10"><Loader className="mx-auto animate-spin" /></div>; }
        if (error) { return <div className="col-span-full text-center p-10 flex items-center justify-center gap-2"><AlertCircle className="text-red-500" /> <p>{error}</p></div>; }
        if (filteredAudio.length === 0) { return <div className="col-span-full text-center p-10 text-gray-500">No audio files found.</div>; }

        return filteredAudio.map((audio) => {
            const isActive = currentlyPlaying?.id === audio.id;
            const isThisTrackPlaying = isActive && isPlaying;

            return (
                // This top-level div is the key. It's the relative parent for the dropdown.
                <div key={audio.id} className="relative" data-dropdown-container={audio.id}>
                    {/* Image and play button container */}
                    <div className="group aspect-square w-full bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <img src={audio.thumbnailUrl || MUSIC_COVER_IMAGE_URL} alt={audio.name} className="w-full h-full object-cover"/>
                        <div
                            className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${isThisTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={() => isThisTrackPlaying ? togglePlayPause() : handlePlayClick(audio)}
                        >
                            <div className="bg-blue-600 text-white rounded-full p-3 shadow-lg">
                                {isThisTrackPlaying ? <Pause size={32} /> : <PlayCircle size={32} />}
                            </div>
                        </div>
                    </div>
                    {/* Text and dropdown trigger container */}
                    <div className="mt-2 flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate" title={audio.name}>
                                {audio.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{audio.type || 'Audio'}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === audio.id ? null : audio.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full flex-shrink-0"
                        >
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    {/* The Dropdown is here, at the top level of the relative parent, ensuring it's not clipped */}
                    {openDropdownId === audio.id && (
                        <DropdownMenu item={audio} onDelete={handleDeleteItem} />
                    )}
                </div>
            );
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header and Search Bar */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Audio</h1>
                <button onClick={() => navigate('/content/upload')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    <Plus className="w-5 h-5 mr-2" /> Add Audio
                </button>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder="Search audio files..." className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8">
                {renderGridView()}
            </div>

            {/* Persistent Audio Player */}
            {currentlyPlaying && (
                <>
                   {/* ... Omitted player JSX for brevity, it remains the same as the previous step ... */}
                   <div className="h-24 sm:h-20" /> {/* Spacer */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex items-center px-4 sm:px-6 z-50">
                        <audio ref={audioRef} src={currentlyPlaying.url} onEnded={handleTrackEnd} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} />
                        <img src={currentlyPlaying.thumbnailUrl || MUSIC_COVER_IMAGE_URL} alt={currentlyPlaying.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                        <div className="ml-4 hidden sm:block">
                            <p className="font-semibold text-gray-800 truncate max-w-[200px]">{currentlyPlaying.name}</p>
                            <p className="text-sm text-gray-500">{currentlyPlaying.type}</p>
                        </div>
                        <div className="flex-grow flex items-center justify-center gap-2 sm:gap-4 mx-4">
                            <button onClick={handlePlayPrevious} disabled={filteredAudio.length < 2} className="p-2 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><SkipBack size={24} /></button>
                            <button onClick={togglePlayPause} className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors">{isPlaying ? <Pause size={28} /> : <PlayCircle size={28} className="relative left-[1px]" />}</button>
                            <button onClick={handlePlayNext} disabled={filteredAudio.length < 2} className="p-2 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><SkipForward size={24} /></button>
                        </div>
                        <div className="flex-grow items-center gap-2 w-full max-w-sm lg:max-w-md hidden md:flex">
                                <span className="text-sm text-gray-600 w-12 text-right">{formatTime(currentTime)}</span>
                                <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSliderChange} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" aria-label="Audio progress slider" />
                                <span className="text-sm text-gray-600 w-12">{formatTime(duration)}</span>
                        </div>
                        <button onClick={closePlayer} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 flex-shrink-0 ml-4"><X size={24} /></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Audio;