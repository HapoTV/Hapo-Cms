// src/features/content/media/Images.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MoreVertical, Plus, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../../../services/content.service';
import { ContentItem } from '../../../types/models/ContentItem';
import { DropdownMenu } from '../components/DropdownMenu';

/**
 * RE-INTRODUCED: This helper function formats the tags for display.
 * It's robust and can handle tags as an array or an object.
 */
const formatTags = (tags?: string[] | Record<string, string>): string => {
    if (!tags) return '—';

    // Case 1: Handle array of strings
    if (Array.isArray(tags)) {
        if (tags.length === 0) return '—';
        return tags.join(', ');
    }

    // Case 2: Handle object of key-value pairs
    if (typeof tags === 'object' && !Array.isArray(tags)) {
        const entries = Object.entries(tags);
        if (entries.length === 0) return '—';
        return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
    }

    // Fallback for any other unexpected type
    return '—';
};


const Images: React.FC = () => {
    const navigate = useNavigate();
    const [imageContent, setImageContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    // This useEffect is now only for closing the dropdown, not a ref
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        // Add listener when a dropdown is open, remove when it's closed
        if (openDropdownId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch content using the "IMAGE" category
                const data = await contentService.getContentByCategory('IMAGE');
                setImageContent(data);
            } catch (err) {
                setError('Failed to fetch image content. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    // --- Client-Side Filtering ---
    const filteredImages = useMemo(() => {
        if (!searchQuery) return imageContent;
        return Array.isArray(imageContent)
            ? imageContent.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [];
    }, [imageContent, searchQuery]);

    // --- Action Handlers ---
    const handleDeleteItem = (idToDelete: number) => {
        // Optimistically update the UI by removing the item from the state
        setImageContent(currentContent => currentContent.filter(item => item.id !== idToDelete));
        setOpenDropdownId(null); // Close the dropdown after deletion
    };

    // --- Grid Renderer ---
    const renderContentGrid = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <Loader className="animate-spin w-8 h-8 text-gray-500" />
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex justify-center items-center p-20 gap-2 text-red-600">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            );
        }
        if (filteredImages.length === 0) {
            return <div className="text-center p-20 text-gray-500">No images found.</div>;
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {filteredImages.map(image => (
                    // THE FIX: Removed `overflow-hidden` from this div
                    <div key={image.id} className="bg-white rounded-lg shadow-md border border-gray-200 group flex flex-col">
                        <div className="relative aspect-square bg-gray-100 flex-shrink-0">
                            <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-t-lg"/>
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownId(openDropdownId === image.id ? null : image.id);
                                    }}
                                    className="p-1.5 bg-white bg-opacity-70 rounded-full text-gray-700 hover:bg-opacity-100 hover:scale-110 transition-transform"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {openDropdownId === image.id && (
                                    <DropdownMenu item={image} onDelete={handleDeleteItem} />
                                )}
                            </div>
                        </div>
                        {/* THE CARD INFO SECTION, NOW WITH TAGS */}
                        <div className="p-3 flex-grow flex flex-col justify-between">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm truncate" title={image.name}>{image.name}</p>
                                {/* ADDED THIS LINE TO DISPLAY TAGS */}
                                <p className="text-xs text-gray-500 mt-1 truncate" title={formatTags(image.tags)}>
                                    Tags: {formatTags(image.tags)}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{new Date(image.uploadDate!).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* The rest of the component's JSX remains the same */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Images</h1>
                <button
                    onClick={() => navigate('/content/upload')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Image
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search image files..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/* Render the Grid */}
            {renderContentGrid()}
        </div>
    );
};

export default Images;