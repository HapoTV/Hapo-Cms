import {useEffect, useRef, useState} from 'react';
import {useContentPagination} from '../../hooks/useContentPagination';
import {AlertCircle, Loader, MoreVertical, Pause, PlayCircle, Search, SkipBack, SkipForward, X} from 'lucide-react';
import {PaginationControls} from '../PaginationControls';
import {DropdownMenu} from '../DropdownMenu';
import {ContentItem} from '../../../../types/models/ContentItem';

// --- Reusable helpers ---
const formatTime = (time: number) => new Date(time * 1000).toISOString().substr(14, 5);
const MUSIC_COVER_IMAGE_URL = 'https://placehold.co/400x400/2563eb/white?text=Audio';

export const AudioTab = () => {
    // Data from our central hook
    const {
        paginatedItems,
        fullFilteredList,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        ...paginationProps
    } = useContentPagination({category: 'AUDIO'});
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // Local UI state for the audio player
    const [currentlyPlaying, setCurrentlyPlaying] = useState<ContentItem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Effect to control the audio element based on player state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        isPlaying ? audio.play().catch(console.error) : audio.pause();
    }, [isPlaying, currentlyPlaying]);

    useEffect(() => {
        if (currentlyPlaying && !fullFilteredList.find(item => item.id === currentlyPlaying.id)) {
            setCurrentlyPlaying(null);
            setIsPlaying(false);
        }
    }, [fullFilteredList, currentlyPlaying]);

    // Player handlers
    const handlePlay = (track: ContentItem) => {
        if (currentlyPlaying?.id !== track.id) setCurrentTime(0);
        setCurrentlyPlaying(track);
        setIsPlaying(true);
    };
    const handlePlayNextPrev = (direction: 'next' | 'prev') => {
        if (!currentlyPlaying || fullFilteredList.length < 2) return;
        const currentIndex = fullFilteredList.findIndex(t => t.id === currentlyPlaying.id);
        const offset = direction === 'next' ? 1 : -1;
        const nextIndex = (currentIndex + offset + fullFilteredList.length) % fullFilteredList.length;
        handlePlay(fullFilteredList[nextIndex]);
    };

    // Grid rendering logic
    const renderGrid = () => {
        if (isLoading && paginatedItems.length === 0) return <div className="flex justify-center p-20"><Loader
            className="animate-spin w-8 h-8"/></div>;
        if (error) return <div className="flex justify-center p-20 gap-2 text-red-600">
            <AlertCircle/><span>{error}</span></div>;
        if (paginatedItems.length === 0) return <div className="text-center p-20 text-gray-500">No audio files
            found.</div>;

        return (
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-8">
                {paginatedItems.map((audio) => {
                    const isActiveAndPlaying = currentlyPlaying?.id === audio.id && isPlaying;
                    return (
                        <div key={audio.id} className="relative">
                            <div className="group aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                                <img src={audio.metadata?.albumArtUrl as string || MUSIC_COVER_IMAGE_URL} alt={audio.name}
                                     className="w-full h-full object-cover"/>
                                <div
                                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => isActiveAndPlaying ? setIsPlaying(false) : handlePlay(audio)}>
                                    {isActiveAndPlaying ? <Pause size={32} className="text-white"/> :
                                        <PlayCircle size={32} className="text-white"/>}
                            </div>
                        </div>
                            <div className="mt-2 flex justify-between items-start">
                                <h3 className="font-semibold text-gray-800 truncate">{audio.name}</h3>
                                <button onClick={() => setOpenDropdownId(openDropdownId === audio.id ? null : audio.id!)}
                                        className="p-1 text-gray-400 hover:text-gray-700">
                                    <MoreVertical size={20}/>
                                </button>
                            </div>
                            {openDropdownId === audio.id && (
                                <DropdownMenu item={audio} onClose={() => setOpenDropdownId(null)}/>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5"/>
                <input type="text" placeholder="Search audio..." value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-lg border"/>
            </div>
            {renderGrid()}
            <PaginationControls
                currentPage={paginationProps.currentPage}
                totalPages={paginationProps.totalPages}
                onPageChange={paginationProps.setCurrentPage} // <-- The Fix!
                totalItems={paginationProps.totalItems}
            />
            {/* Persistent Audio Player */}
            {currentlyPlaying && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-4 z-40">
                    <audio ref={audioRef} src={currentlyPlaying.url} onEnded={() => handlePlayNextPrev('next')}
                           onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
                           onLoadedMetadata={e => setDuration(e.currentTarget.duration)}/>
                    <img src={currentlyPlaying.metadata?.albumArtUrl as string || MUSIC_COVER_IMAGE_URL}
                         alt={currentlyPlaying.name} className="w-12 h-12 rounded-md object-cover"/>
                    <div className="flex-grow flex items-center justify-center gap-4">
                        <button onClick={() => handlePlayNextPrev('prev')}><SkipBack size={24}/></button>
                        <button onClick={() => setIsPlaying(p => !p)}
                                className="p-2 rounded-full bg-blue-600 text-white">{isPlaying ? <Pause size={28}/> :
                            <PlayCircle size={28}/>}</button>
                        <button onClick={() => handlePlayNextPrev('next')}><SkipForward size={24}/></button>
                    </div>
                    <div className="flex-grow items-center gap-2 w-full max-w-md hidden md:flex">
                        <span className="text-sm">{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration || 0} value={currentTime}
                               onChange={e => audioRef.current!.currentTime = +e.target.value}
                               className="w-full accent-blue-600"/>
                        <span className="text-sm">{formatTime(duration)}</span>
                    </div>
                    <button onClick={() => {
                        setIsPlaying(false);
                        setCurrentlyPlaying(null);
                    }}><X size={24}/></button>
                </div>
            )}
        </div>
    );
};