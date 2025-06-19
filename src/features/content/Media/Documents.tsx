import React, { useState, useEffect, useMemo } from 'react';
import { Search, MoreVertical, Plus, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../../../services/content.service';
import { ContentItem } from '../../../types/models/ContentItem';

const formatTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '—';
    return tags.join(', ');
};

const Documents: React.FC = () => {
    const navigate = useNavigate();
    const [documentContent, setDocumentContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // Fetch content using the "DOCUMENT" category.
                // Ensure your backend has this category defined.
                const data = await contentService.getContentByCategory('DOCUMENT');
                setDocumentContent(data);
            } catch (err) {
                setError('Failed to fetch document content. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const filteredDocuments = useMemo(() => {
        if (!searchQuery) return documentContent;
        return Array.isArray(documentContent)
            ? documentContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];
    }, [documentContent, searchQuery]);

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={5} className="text-center p-8">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                            <Loader className="animate-spin" />
                            <span>Loading documents...</span>
                        </div>
                    </td>
                </tr>
            );
        }
        if (error) {
            return (
                <tr>
                    <td colSpan={5} className="text-center p-8">
                        <div className="flex justify-center items-center gap-2 text-red-500">
                            <AlertCircle />
                            <span>{error}</span>
                        </div>
                    </td>
                </tr>
            );
        }
        if (filteredDocuments.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                        No documents found.
                    </td>
                </tr>
            );
        }
        return filteredDocuments.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                <td className="px-6 py-4 font-medium text-gray-900">{doc.name}</td>
                <td className="px-6 py-4 text-gray-600">{doc.uploadDate ? new Date(doc.uploadDate).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={formatTags(doc.tags)}>{formatTags(doc.tags)}</td>
                <td className="px-6 py-4 text-right">
                    <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <button
                    onClick={() => navigate('/content/upload')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Document
                </button>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Modified</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Documents;