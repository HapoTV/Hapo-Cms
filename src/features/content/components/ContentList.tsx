import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Search, MoreVertical, Plus, Loader, AlertCircle, LayoutGrid, List, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../../../services/content.service';
import { ContentItem } from '../../../types/models/ContentItem';
import { DropdownMenu } from './DropdownMenu'; // <-- IMPORT THE DROPDOWN

const MUSIC_COVER_IMAGE_URL = 'https://african-arts-and-crafts-bucket.s3.eu-north-1.amazonaws.com/60320693-782c-4b22-8ea4-6d188f9c0301.jpg';
type ViewMode = 'list' | 'grid';

const ITEMS_PER_PAGE = 25; // 5x5 grid

const formatTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '—';
    return tags.join(', ');
};

const getThumbnailUrl = (item: ContentItem): string => {
    const isVideo = ['MP4', 'AVI', 'MKV', 'MOV', 'FLV', 'WMV', 'WEBM'].includes(item.type);
    const isAudio = ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'WMA', 'M4A'].includes(item.type);
    const isImage = ['JPEG', 'JPG', 'PNG', 'GIF', 'BMP', 'TIFF', 'SVG'].includes(item.type);
    const isPresentation = ['PPT', 'PPTX'].includes(item.type);

    if (isImage) return item.url;
    if (isAudio) return MUSIC_COVER_IMAGE_URL;
    if (isPresentation) return '/thumbnails/presentation.png';

    // Default fallback
    return `https://via.placeholder.com/150/E2E8F0/4A5568?text=${item.type}`;
};

export const ContentList = () => {
    const [allContent, setAllContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid'); // Default to grid view
    const [currentPage, setCurrentPage] = useState(1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllContent = async () => {
            try {
                const data = await contentService.getAllContent();
                setAllContent(data);
            } catch (err) {
                setError('Failed to load content library.');
                console.error("Error fetching content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllContent();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset to the first page whenever the search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, viewMode]);

    const filteredContent = useMemo(() => {
        if (!searchQuery) return allContent;
        return allContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allContent, searchQuery]);

    // New memoized value for paginated data
    const { paginatedContent, totalPages } = useMemo(() => {
        const totalItems = filteredContent.length;
        const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const items = filteredContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        return { paginatedContent: items, totalPages: pages };
    }, [filteredContent, currentPage]);

    // Handler to remove item from state after deletion
    const handleDeleteItem = (id: number) => {
        setAllContent(prevContent => prevContent.filter(item => item.id !== id));
        setOpenDropdownId(null); // Close dropdown after deletion
    };

    // Helper to toggle dropdown visibility
    const toggleDropdown = (itemId: number) => {
        setOpenDropdownId(prevId => (prevId === itemId ? null : itemId));
    };

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center p-8"><Loader className="animate-spin text-blue-600" size={32} /></div>;
        if (error) return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center"><AlertCircle className="mr-2" /> {error}</div>;
        if (filteredContent.length === 0) return <div className="text-center p-8 text-gray-500">No content found.</div>;

        if (viewMode === 'grid') {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {paginatedContent.map(item => (
                        <div key={item.id} className="relative bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group transition-shadow hover:shadow-xl">
                            <div className="relative aspect-square bg-gray-100">
                                <img src={getThumbnailUrl(item)} alt={item.name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all"></div>
                            </div>
                            <div className="p-3">
                                <p className="font-semibold text-gray-800 truncate" title={item.name}>{item.name}</p>
                                <p className="text-sm text-gray-500">{item.type}</p>
                            </div>

                            {/* --- Dropdown Trigger and Menu --- */}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleDropdown(item.id); }}
                                className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical size={18} />
                            </button>
                            {openDropdownId === item.id && (
                                <div ref={dropdownRef}>
                                    <DropdownMenu item={item} onDelete={handleDeleteItem} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // --- List View ---
        return (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Modified</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedContent.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 text-gray-600">{item.type}</td>
                                <td className="px-6 py-4 text-gray-600">{new Date(item.uploadDate).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{item.tags?.join(', ') || '—'}</td>
                                <td className="px-6 py-4 text-right relative">
                                    {/* --- Dropdown Trigger and Menu --- */}
                                    <button
                                        onClick={() => toggleDropdown(item.id)}
                                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openDropdownId === item.id && (
                                        <div ref={dropdownRef}>
                                            <DropdownMenu item={item} onDelete={handleDeleteItem} />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
                <Link to="upload" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Content
                </Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div className="relative flex-1 min-w-[250px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder="Search content..." className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-300'}`}>
                        <List size={20} />
                    </button>
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-300'}`}>
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            {renderContent()}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                    </button>
                    <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
};