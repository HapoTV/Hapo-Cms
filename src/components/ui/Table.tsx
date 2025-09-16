// src/components/ui/Table.tsx

import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';
import {LoadingSpinner} from './LoadingSpinner';

export interface TableColumn<T = any> {
    key: string;
    title: string;
    dataIndex?: keyof T;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
}

export interface TableProps<T = any> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    rowKey?: keyof T | ((record: T) => string | number);
    onRowClick?: (record: T, index: number) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    striped?: boolean;
    bordered?: boolean;
}

export const Table = <T extends Record<string, any>>({
                                                         columns,
                                                         data,
                                                         loading = false,
                                                         emptyText = 'No data available',
                                                         rowKey = 'id',
                                                         onRowClick,
                                                         className = '',
                                                         size = 'md',
                                                         striped = false,
                                                         bordered = true,
                                                     }: TableProps<T>) => {
    const {currentTheme} = useTheme();

    const getSizeStyles = () => {
        const {spacing, typography} = currentTheme;
        const sizes = {
            sm: {
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.sm,
            },
            md: {
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: typography.fontSize.base,
            },
            lg: {
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.lg,
            },
        };

        return sizes[size];
    };

    const sizeStyles = getSizeStyles();

    const tableContainerStyles: React.CSSProperties = {
        width: '100%',
        borderRadius: currentTheme.borderRadius.lg,
        overflow: 'hidden',
        boxShadow: currentTheme.shadows.sm,
        border: bordered ? `1px solid ${currentTheme.colors.border.primary}` : 'none',
    };

    const headerStyles: React.CSSProperties = {
        backgroundColor: currentTheme.colors.background.secondary,
        // The bottom border on the header is now also controlled by the 'bordered' prop
        borderBottom: bordered ? `1px solid ${currentTheme.colors.border.primary}` : 'none',
    };

    const headerCellStyles: React.CSSProperties = {
        ...sizeStyles,
        color: currentTheme.colors.text.primary,
        fontWeight: currentTheme.typography.fontWeight.semibold,
        fontFamily: currentTheme.typography.fontFamily.sans,
        textAlign: 'left',
        // 1. CORRECTED: Removed the vertical border from header cells
    };

    const rowStyles: React.CSSProperties = {
        // 2. CORRECTED: The bottom border on rows is now controlled by the 'bordered' prop
        borderBottom: bordered ? `1px solid ${currentTheme.colors.border.primary}` : 'none',
        transition: 'background-color 0.2s ease-in-out',
        cursor: onRowClick ? 'pointer' : 'default',
    };

    const cellStyles: React.CSSProperties = {
        ...sizeStyles,
        color: currentTheme.colors.text.primary,
        fontFamily: currentTheme.typography.fontFamily.sans,
    };

    const getRowKey = (record: T, index: number): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(record);
        }
        return record[rowKey] || index;
    };

    const handleRowMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (onRowClick) {
            e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
        }
    };

    const handleRowMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>, isStriped: boolean) => {
        if (onRowClick) {
            e.currentTarget.style.backgroundColor = isStriped ? currentTheme.colors.background.secondary : 'transparent';
        }
    };

    const renderCell = (column: TableColumn<T>, record: T, index: number) => {
        if (column.render) {
            return column.render(record[column.dataIndex as keyof T], record, index);
        }

        if (column.dataIndex) {
            return record[column.dataIndex as keyof T] as React.ReactNode;
        }

        return null;
    };

    return (
        <div style={tableContainerStyles} className={`ui-table-container ${className}`}>
            <table style={{width: '100%', borderCollapse: 'collapse'}} className="ui-table">
                <thead style={headerStyles}>
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={column.key}
                            style={{
                                ...headerCellStyles,
                                width: column.width,
                                textAlign: column.align || 'left',
                                paddingLeft: index === 0 ? currentTheme.spacing.lg : undefined,
                                paddingRight: index === columns.length - 1 ? currentTheme.spacing.lg : undefined,
                            }}
                            className="ui-table-header-cell"
                        >
                            {column.title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td
                            colSpan={columns.length}
                            style={{...cellStyles, textAlign: 'center', padding: currentTheme.spacing.xl}}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: currentTheme.spacing.sm
                            }}>
                                <LoadingSpinner size="md"/>
                                <span>Loading...</span>
                            </div>
                        </td>
                    </tr>
                ) : data.length === 0 ? (
                    <tr>
                        <td
                            colSpan={columns.length}
                            style={{
                                ...cellStyles,
                                textAlign: 'center',
                                padding: currentTheme.spacing.xl,
                                color: currentTheme.colors.text.tertiary,
                            }}
                        >
                            {emptyText}
                        </td>
                    </tr>
                ) : (
                    data.map((record, rowIndex) => {
                        const isLastRow = rowIndex === data.length - 1;
                        const isStriped = striped && rowIndex % 2 === 1;
                        const finalRowStyles = {
                                ...rowStyles,
                            borderBottom: isLastRow || !bordered ? 'none' : rowStyles.borderBottom,
                            backgroundColor: isStriped ? currentTheme.colors.background.secondary : 'transparent',
                        };

                        return (
                            <tr
                                key={getRowKey(record, rowIndex)}
                                style={finalRowStyles}
                            className="ui-table-row"
                                onClick={() => onRowClick?.(record, rowIndex)}
                            onMouseEnter={handleRowMouseEnter}
                                onMouseLeave={(e) => handleRowMouseLeave(e, isStriped)}
                        >
                                {columns.map((column, colIndex) => (
                                <td
                                    key={column.key}
                                    style={{
                                        ...cellStyles,
                                        textAlign: column.align || 'left',
                                        paddingLeft: colIndex === 0 ? currentTheme.spacing.lg : undefined,
                                        paddingRight: colIndex === columns.length - 1 ? currentTheme.spacing.lg : undefined,
                                    }}
                                    className="ui-table-cell"
                                >
                                    {renderCell(column, record, rowIndex)}
                                </td>
                            ))}
                        </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};