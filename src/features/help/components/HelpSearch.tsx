import React, {useEffect, useState} from 'react';
import {Search, X} from 'lucide-react';

interface HelpSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    initialValue?: string;
}

export const HelpSearch: React.FC<HelpSearchProps> = ({
                                                          onSearch,
                                                          placeholder = "Search help articles...",
                                                          initialValue = ""
                                                      }) => {
    const [query, setQuery] = useState(initialValue);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative max-w-2xl mx-auto">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                )}
            </div>
        </div>
    );
};