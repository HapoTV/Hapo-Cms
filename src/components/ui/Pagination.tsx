import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';
import {Button} from './Button';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    showInfo?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                          totalItems,
                                                          itemsPerPage,
                                                          showInfo = true,
                                                          size = 'md',
                                                          className = '',
                                                      }) => {
    const {currentTheme} = useTheme();

    if (totalPages <= 1) {
        return null;
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

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: currentTheme.spacing.md,
        marginTop: currentTheme.spacing.lg,
    };

    const infoStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.sm,
        color: currentTheme.colors.text.secondary,
        fontFamily: currentTheme.typography.fontFamily.sans,
    };

    const paginationControlsStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: currentTheme.spacing.sm,
    };

    const pageButtonStyles: React.CSSProperties = {
        minWidth: size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem',
        height: size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${currentTheme.colors.border.primary}`,
        borderRadius: currentTheme.borderRadius.md,
        backgroundColor: currentTheme.colors.background.primary,
        color: currentTheme.colors.text.primary,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        fontSize: currentTheme.typography.fontSize.sm,
        fontFamily: currentTheme.typography.fontFamily.sans,
        fontWeight: currentTheme.typography.fontWeight.medium,
    };

    const activePageButtonStyles: React.CSSProperties = {
        ...pageButtonStyles,
        backgroundColor: currentTheme.colors.brand.primary,
        borderColor: currentTheme.colors.brand.primary,
        color: currentTheme.colors.text.inverse,
    };

    const visiblePages = getVisiblePages();

    return (
        <div style={containerStyles} className={`ui-pagination ${className}`}>
            {showInfo && totalItems && (
                <p style={infoStyles}>
                    Showing page <span
                    style={{fontWeight: currentTheme.typography.fontWeight.medium}}>{currentPage}</span> of{' '}
                    <span style={{fontWeight: currentTheme.typography.fontWeight.medium}}>{totalPages}</span>
                    {itemsPerPage && (
                        <> ({totalItems} total items)</>
                    )}
                </p>
            )}

            <div style={paginationControlsStyles}>
                <Button
                    variant="outline"
                    size={size}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    leftIcon={<ChevronLeft className="w-4 h-4"/>}
                >
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span
                                    style={{
                                        padding: currentTheme.spacing.sm,
                                        color: currentTheme.colors.text.tertiary,
                                    }}
                                >
                  ...
                </span>
                            ) : (
                                <button
                                    style={currentPage === page ? activePageButtonStyles : pageButtonStyles}
                                    className="ui-pagination-page"
                                    onClick={() => onPageChange(page as number)}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== page) {
                                            e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                                            e.currentTarget.style.borderColor = currentTheme.colors.border.secondary;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== page) {
                                            e.currentTarget.style.backgroundColor = currentTheme.colors.background.primary;
                                            e.currentTarget.style.borderColor = currentTheme.colors.border.primary;
                                        }
                                    }}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size={size}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    rightIcon={<ChevronRight className="w-4 h-4"/>}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};