import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
                                                                          currentPage,
                                                                          totalPages,
                                                                          onPageChange,
                                                                          totalItems
                                                                      }) => {
    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
                Showing page <span className="font-medium">{currentPage}</span> of <span
                className="font-medium">{totalPages}</span> ({totalItems} items)
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4"/>
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
};
