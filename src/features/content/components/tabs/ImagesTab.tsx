import {useState} from 'react';
import {AlertCircle, Loader, MoreVertical, Search} from 'lucide-react';
import {useContentPagination} from '../../hooks/useContentPagination';
import {PaginationControls} from '../PaginationControls';
import {DropdownMenu} from '../DropdownMenu';

const formatTags = (tags?: string[] | Record<string, string>): string => {
    if (!tags) return '—';
    if (Array.isArray(tags)) return tags.length > 0 ? tags.join(', ') : '—';
    const values = Object.values(tags);
    return values.length > 0 ? values.join(', ') : '—';
};

export const ImagesTab = () => {
    const {
        paginatedItems,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        ...paginationProps
    } = useContentPagination({category: 'IMAGE'});
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const renderContent = () => {
        if (isLoading && paginatedItems.length === 0) return <div className="flex justify-center p-20"><Loader
            className="animate-spin w-8 h-8"/></div>;
        if (error) return <div className="flex justify-center p-20 gap-2 text-red-600">
            <AlertCircle/><span>{error}</span></div>;
        if (paginatedItems.length === 0) return <div className="text-center p-20 text-gray-500">No images found.</div>;

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {paginatedItems.map(image => (
                    <div key={image.id} className="relative bg-white rounded-lg shadow-md border group flex flex-col">
                        <div className="aspect-square bg-gray-100">
                            <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-t-lg"/>
                        </div>
                        <div className="absolute top-2 right-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(openDropdownId === image.id ? null : image.id);
                                }}
                                className="p-1.5 bg-white/70 rounded-full hover:bg-white/100"
                            >
                                <MoreVertical size={20}/>
                            </button>
                            {openDropdownId === image.id && (
                                <DropdownMenu item={image} onClose={() => setOpenDropdownId(null)}/>
                            )}
                        </div>
                        <div className="p-3">
                            <p className="font-semibold text-sm truncate">{image.name}</p>
                            <p className="text-xs text-gray-500 mt-1 truncate" title={formatTags(image.tags)}>
                                Tags: {formatTags(image.tags)}
                            </p>
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
                <input type="text" placeholder="Search images..." value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-lg border"/>
            </div>
            {renderContent()}
            <PaginationControls
                currentPage={paginationProps.currentPage}
                totalPages={paginationProps.totalPages}
                onPageChange={paginationProps.setCurrentPage} // <-- The Fix!
                totalItems={paginationProps.totalItems}
            />
        </div>
    );
};