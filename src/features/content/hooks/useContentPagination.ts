import {useEffect, useMemo, useState} from 'react';
import {useContentStore} from '../store/content.store';
import {isItemInCategory} from '../util/fileTypeUtils'; // <-- Import our new utility

const ITEMS_PER_PAGE = 12;

interface UseContentPaginationProps {
    category: 'ALL' | 'AUDIO' | 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'WEBPAGE';
}

export const useContentPagination = ({category}: UseContentPaginationProps) => {
    const {contentItems, isLoading, error, fetchContentByCategory} = useContentStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // This effect now runs whenever the category changes.
    useEffect(() => {
        fetchContentByCategory(category);
    }, [category, fetchContentByCategory]);

    // This memo now correctly filters the central cache based on category.
    const filteredItems = useMemo(() => {
        // 1. Filter by category first, using our utility function
        const categoryFiltered = contentItems.filter(item => isItemInCategory(item.type, category));

        // 2. Then, filter by the search query
        let searchFiltered = categoryFiltered;
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            searchFiltered = categoryFiltered.filter(item =>
                item.name.toLowerCase().includes(lowercasedQuery) ||
                (Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
            );
        }

        // Reset to page 1 whenever the filter results change
        setCurrentPage(1);

        return searchFiltered;
    }, [contentItems, category, searchQuery]);

    // This pagination logic remains the same
    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    return {
        paginatedItems,
        fullFilteredList: filteredItems,
        isLoading: isLoading && paginatedItems.length === 0, // Only show master loading spinner on initial load
        error,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems: filteredItems.length,
    };
};