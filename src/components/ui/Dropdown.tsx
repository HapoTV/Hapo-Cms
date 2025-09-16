// src/components/ui/Dropdown.tsx

import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
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
    placeholder?: string | React.ReactNode;
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
    const [position, setPosition] = useState({top: 0, left: 0, width: 0});
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {currentTheme} = useTheme();

    // Effect to handle closing the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close if the click is outside both the trigger button and the dropdown menu
            if (
                triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (disabled) return;

        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Position the menu below the trigger button
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
        setIsOpen(!isOpen);
    };

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
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
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

    // This component now returns a Fragment
    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                style={triggerStyles}
                className={`ui-dropdown-trigger ${className}`}
                onClick={handleToggle}
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
                <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.sm}}>
                    {selectedOption?.icon}
                    <span>{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown
                    style={{
                        color: currentTheme.colors.text.tertiary,
                        transition: 'transform 0.2s ease-in-out',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    size={16}
                />
            </button>

            {isOpen && createPortal(
                // 3. The menu is rendered in a portal to escape parent overflow containers
                <div ref={dropdownRef} style={dropdownStyles} className="ui-dropdown-menu">
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
                </div>,
                document.body
            )}
        </>
    );
};