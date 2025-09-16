import React from 'react';
import {Search, X} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';
import {Input, InputProps} from './Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon' | 'type'> {
    onClear?: () => void;
    showClearButton?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
                                                            onClear,
                                                            showClearButton = true,
                                                            value,
                                                            className = '',
                                                            ...props
                                                        }) => {
    const {currentTheme} = useTheme();

    const handleClear = () => {
        if (onClear) {
            onClear();
        }
    };

    const clearButtonStyles: React.CSSProperties = {
        color: currentTheme.colors.text.tertiary,
        cursor: 'pointer',
        transition: 'color 0.2s ease-in-out',
    };

    return (
        <Input
            type="text"
            leftIcon={<Search className="w-5 h-5"/>}
            rightIcon={
                showClearButton && value ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={clearButtonStyles}
                        className="hover:opacity-70 focus:outline-none transition-opacity"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.text.secondary;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = currentTheme.colors.text.tertiary;
                        }}
                    >
                        <X className="w-5 h-5"/>
                    </button>
                ) : undefined
            }
            value={value}
            className={`ui-search-input ${className}`}
            {...props}
        />
    );
};