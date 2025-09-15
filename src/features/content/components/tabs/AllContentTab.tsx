import {useState} from 'react';
import {AlertCircle, ArrowDown, ArrowUp, FileText, Image, Loader, MoreVertical, Music, Search, Video} from 'lucide-react';
import {useContentPagination} from '../../hooks/useContentPagination';
import {PaginationControls} from '../PaginationControls';
import {DropdownMenu} from '../DropdownMenu';

// Helper to get an icon based on the content type string from your backend
const getIconForType = (type: string) => {
    switch (type.toUpperCase()) {
        case 'IMAGE':
        case 'JPEG':
        case 'JPG':
        case 'PNG':
        case 'GIF':
            return <Image className="w-5 h-5 text-purple-500"/>;
        case 'VIDEO':
        case 'MP4':
        case 'MOV':
        case 'AVI':
            return <Video className="w-5 h-5 text-red-500"/>;
        case 'AUDIO':
        case 'MP3':
        case 'WAV':
        case 'M4A':
            return <Music className="w-5 h-5 text-blue-500"/>;
        case 'DOCUMENT':
        case 'PDF':
        case 'DOCX':
        case 'PPTX':
            return <FileText className="w-5 h-5 text-green-500"/>;
        default:
            return <FileText className="w-5 h-5 text-gray-500"/>;
    }
};

type SortDirection = 'asc' | 'desc';
type SortField = 'name' | 'uploadDate';

export const AllContentTab = () => {
    const {
        paginatedItems,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        ...paginationProps
    } = useContentPagination({category: 'ALL'});
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{
        field: SortField;
        direction: SortDirection;
    }>({ field: 'name', direction: 'asc' });

    // Handle sort when clicking on column headers
    const handleSort = (field: SortField) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Sort the items based on the current sort configuration
    const sortedItems = [...paginatedItems].sort((a, b) => {
        if (sortConfig.field === 'name') {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return sortConfig.direction === 'asc' 
                ? nameA.localeCompare(nameB) 
                : nameB.localeCompare(nameA);
        } else {
            const dateA = new Date(a.uploadDate!).getTime();
            const dateB = new Date(b.uploadDate!).getTime();
            return sortConfig.direction === 'asc' 
                ? dateB - dateA // Newest first
                : dateA - dateB; // Oldest first
        }
    });

    const renderSortIcon = (field: SortField) => {
        if (sortConfig.field !== field) {
            return <ArrowUp className="w-3 h-3 ml-1 opacity-30" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ArrowUp className="w-3 h-3 ml-1" /> 
            : <ArrowDown className="w-3 h-3 ml-1" />;
    };

    const renderTable = () => {
        if (isLoading && paginatedItems.length === 0) {
            return <tr>
                <td colSpan={5} className="text-center p-8"><Loader className="animate-spin inline-block"/></td>
            </tr>;
        }
        if (error) {
            return <tr>
                <td colSpan={5} className="text-center p-8 text-red-500"><AlertCircle
                    className="inline-block mr-2"/>{error}</td>
            </tr>;
        }
        if (paginatedItems.length === 0) {
            return <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">No content found.</td>
            </tr>;
        }

        return sortedItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                    {getIconForType(item.type)}
                    <span className="font-medium text-gray-900">{item.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.type}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(item.uploadDate!).toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{Array.isArray(item.tags) ? item.tags.join(', ') : '—'}</td>
                <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id!)}
                            className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5"/>
                    </button>
                    {openDropdownId === item.id && (
                        <DropdownMenu item={item} onClose={() => setOpenDropdownId(null)}/>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5"/>
                <input type="text" placeholder="Search all content..." value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-lg border focus:border-blue-500 focus:ring-blue-500"/>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center">
                                Name
                                {renderSortIcon('name')}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('uploadDate')}
                        >
                            <div className="flex items-center">
                                Date Added
                                {renderSortIcon('uploadDate')}
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {renderTable()}
                    </tbody>
                </table>
            </div>
            <PaginationControls
                currentPage={paginationProps.currentPage}
                totalPages={paginationProps.totalPages}
                onPageChange={paginationProps.setCurrentPage}
                totalItems={paginationProps.totalItems}
            />
        </div>
    );
};