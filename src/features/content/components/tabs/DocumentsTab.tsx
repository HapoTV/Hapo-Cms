// src/features/content/Media/DocumentsTab.tsx

import {useState} from 'react';
import {AlertCircle, Loader, MoreVertical, Search} from 'lucide-react';
import {useContentPagination} from '../../hooks/useContentPagination';
import {PaginationControls} from '../PaginationControls';
import {DropdownMenu} from '../DropdownMenu';

export const DocumentsTab = () => {
    const {
        paginatedItems,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        ...paginationProps
    } = useContentPagination({category: 'DOCUMENT'});
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const renderTable = () => {
        if (isLoading && paginatedItems.length === 0) return <tr>
            <td colSpan={5} className="text-center p-8"><Loader className="animate-spin inline-block"/></td>
        </tr>;
        if (error) return <tr>
            <td colSpan={5} className="text-center p-8 text-red-500"><AlertCircle className="inline-block mr-2"/>{error}
            </td>
        </tr>;
        if (paginatedItems.length === 0) return <tr>
            <td colSpan={5} className="text-center p-8 text-gray-500">No documents found.</td>
        </tr>;

        return paginatedItems.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{doc.name}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(doc.uploadDate!).toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{Array.isArray(doc.tags) ? doc.tags.join(', ') : '—'}</td>
                <td className="px-6 py-4 text-right relative">
                    <button onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                            className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {openDropdownId === doc.id && (
                        <DropdownMenu item={doc} onClose={() => setOpenDropdownId(null)}/>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5"/>
                <input type="text" placeholder="Search documents..." value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 rounded-lg border"/>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date Modified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tags</th>
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
                onPageChange={paginationProps.setCurrentPage} // <-- The Fix!
                totalItems={paginationProps.totalItems}
            />
        </div>
    );
};