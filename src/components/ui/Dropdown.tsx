import React, {useEffect, useRef, useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';

export interface DropdownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string;
    placeholder?: string;
    onSelect: (value: string) => void;
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outlined' | 'filled';
}

export const Dropdown: React.FC<DropdownProps> = ({
                                                      options,
                                                      value,
                                                      placeholder = 'Select an option',
                                                      onSelect,
                                                      disabled = false,
                                                      className = '',
                                                      size = 'md',
                                                      variant = 'default',
                                                  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {currentTheme} = useTheme();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            default: {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderColor: colors.border.primary,
            },
            filled: {
                backgroundColor: colors.background.secondary,
                borderColor: 'transparent',
            },
        };

        return variants[variant];
    };

    const getSizeStyles = () => {
        const {spacing, typography} = currentTheme;

        const sizes = {
            sm: {
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.sm,
                height: '2rem',
            },
            md: {
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: typography.fontSize.base,
                height: '2.5rem',
            },
            lg: {
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.lg,
                height: '3rem',
            },
        };

        return sizes[size];
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();
    const selectedOption = options.find(opt => opt.value === value);

    const triggerStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        border: '1px solid',
        borderRadius: currentTheme.borderRadius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        fontFamily: currentTheme.typography.fontFamily.sans,
        color: disabled ? currentTheme.colors.text.tertiary : currentTheme.colors.text.primary,
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
        ...variantStyles,
        ...sizeStyles,
    };

    const dropdownStyles: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: currentTheme.spacing.xs,
        backgroundColor: currentTheme.colors.background.primary,
        border: `1px solid ${currentTheme.colors.border.primary}`,
        borderRadius: currentTheme.borderRadius.md,
        boxShadow: currentTheme.shadows.lg,
        zIndex: 50,
        maxHeight: '200px',
        overflowY: 'auto',
    };

    const optionStyles: React.CSSProperties = {
        padding: `${currentTheme.spacing.sm} ${currentTheme.spacing.md}`,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        fontSize: sizeStyles.fontSize,
        fontFamily: currentTheme.typography.fontFamily.sans,
        display: 'flex',
        alignItems: 'center',
        gap: currentTheme.spacing.sm,
    };

    const handleSelect = (optionValue: string) => {
        if (!disabled) {
            onSelect(optionValue);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className={`ui-dropdown relative ${className}`}>
            <button
                type="button"
                style={triggerStyles}
                className="ui-dropdown-trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                onFocus={(e) => {
                    if (!disabled) {
                        e.target.style.borderColor = currentTheme.colors.border.focus;
                        e.target.style.boxShadow = `0 0 0 3px ${currentTheme.colors.border.focus}20`;
                    }
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = variantStyles.borderColor;
                    e.target.style.boxShadow = 'none';
                }}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.icon}
                    <span>{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{color: currentTheme.colors.text.tertiary}}
                />
            </button>

            {isOpen && (
                <div style={dropdownStyles} className="ui-dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            style={{
                                ...optionStyles,
                                color: option.disabled ? currentTheme.colors.text.tertiary : currentTheme.colors.text.primary,
                                cursor: option.disabled ? 'not-allowed' : 'pointer',
                                opacity: option.disabled ? 0.5 : 1,
                            }}
                            className="ui-dropdown-option"
                            onClick={() => !option.disabled && handleSelect(option.value)}
                            onMouseEnter={(e) => {
                                if (!option.disabled) {
                                    e.currentTarget.style.backgroundColor = currentTheme.colors.background.secondary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {option.icon}
                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};