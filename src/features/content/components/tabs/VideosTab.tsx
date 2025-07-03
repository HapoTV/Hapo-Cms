import {useState} from 'react';
import {AlertCircle, Loader, MoreVertical, PlayCircle, Search, X} from 'lucide-react';
import {useContentPagination} from '../../hooks/useContentPagination';
import {PaginationControls} from '../PaginationControls';
import {DropdownMenu} from '../DropdownMenu';
import {ContentItem} from '../../../../types/models/ContentItem';

export const VideosTab = () => {
    const {
        paginatedItems,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        ...paginationProps
    } = useContentPagination({category: 'VIDEO'});
    const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const renderGrid = () => {
        if (isLoading && paginatedItems.length === 0) return <div className="flex justify-center p-20"><Loader
            className="animate-spin w-8 h-8"/></div>;
        if (error) return <div className="flex justify-center p-20 gap-2 text-red-600">
            <AlertCircle/><span>{error}</span></div>;
        if (paginatedItems.length === 0) return <div className="text-center p-20 text-gray-500">No videos found.</div>;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedItems.map(video => (
                    <div key={video.id} className="relative bg-white rounded-lg shadow-md border group">
                        <div onClick={() => setSelectedVideo(video)} className="cursor-pointer">
                            <div className="aspect-video bg-black">
                                <video src={`${video.url}#t=0.1`} className="w-full h-full object-cover rounded-t-lg"
                                       preload="metadata" muted playsInline/>
                                <div
                                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="w-16 h-16 text-white/80"/>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-gray-800 truncate" title={video.name}>{video.name}</p>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2">
                            <button onClick={() => setOpenDropdownId(openDropdownId === video.id ? null : video.id)}
                                    className="p-1.5 bg-white/70 rounded-full hover:bg-white/100">
                                <MoreVertical size={20}/>
                            </button>
                            {openDropdownId === video.id && (
                                <DropdownMenu item={video} onClose={() => setOpenDropdownId(null)}/>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5"/>
                <input type="text" placeholder="Search videos..." value={searchQuery}
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

            {selectedVideo && (
                <div onClick={() => setSelectedVideo(null)}
                     className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <div onClick={(e) => e.stopPropagation()} className="relative bg-black rounded-lg w-full max-w-4xl">
                        <button onClick={() => setSelectedVideo(null)}
                                className="absolute -top-3 -right-3 bg-white rounded-full p-1 z-10">
                            <X size={24}/>
                        </button>
                        <video src={selectedVideo.url} className="w-full max-h-[85vh] rounded-lg" controls autoPlay/>
                    </div>
                </div>
            )}
        </div>
    );
};