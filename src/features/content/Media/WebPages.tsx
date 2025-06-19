import React, { useState, useEffect, useMemo } from 'react';
import { Search, MoreVertical, Plus, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../../../services/content.service';
import { ContentItem } from '../../../types/models/ContentItem';

const formatTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '—';
    return tags.join(', ');
};

const WebPages: React.FC = () => {
    const navigate = useNavigate();
    const [webPageContent, setWebPageContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchWebPages = async () => {
            try {
                // Fetch content using the "WEBPAGE" category.
                // Ensure your backend has this category defined.
                const data = await contentService.getContentByCategory('WEBPAGE');
                setWebPageContent(data);
            } catch (err) {
                setError('Failed to fetch web page content. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWebPages();
    }, []);

    const filteredWebPages = useMemo(() => {
        if (!searchQuery) return webPageContent;
        return Array.isArray(webPageContent)
            ? webPageContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];
    }, [webPageContent, searchQuery]);

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                            <Loader className="animate-spin" />
                            <span>Loading web pages...</span>
                        </div>
                    </td>
                </tr>
            );
        }
        if (error) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8">
                        <div className="flex justify-center items-center gap-2 text-red-500">
                            <AlertCircle />
                            <span>{error}</span>
                        </div>
                    </td>
                </tr>
            );
        }
        if (filteredWebPages.length === 0) {
            return (
                <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">
                        No web pages found.
                    </td>
                </tr>
            );
        }
        return filteredWebPages.map((page) => (
            <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                <td className="px-6 py-4 font-medium text-gray-900">{page.name}</td>
                <td className="px-6 py-4 text-blue-600 hover:text-blue-800 hover:underline">
                    <a href={page.url} target="_blank" rel="noopener noreferrer">
                        {page.url}
                    </a>
                </td>
                <td className="px-6 py-4 text-gray-600">{page.uploadDate ? new Date(page.uploadDate).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={formatTags(page.tags)}>{formatTags(page.tags)}</td>
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
                <h1 className="text-2xl font-bold text-gray-900">Web Pages</h1>
                <button
                    onClick={() => navigate('/content/upload-webpage')} // Or a specific 'add web page' route
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Web Page
                </button>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder="Search web pages..." className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address (URL)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
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

export default WebPages;