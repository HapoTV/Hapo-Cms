// src/components/ui/Input.tsx

import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';

// We can create a union type for all possible props our component can accept
type AllInputProps = React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>;

export interface InputProps extends AllInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled' | 'outlined';
    inputSize?: 'sm' | 'md' | 'lg';
    // CHANGED: Added 'as' prop to allow polymorphism
    as?: 'input' | 'textarea' | 'select';
    children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                helperText,
                                                leftIcon,
                                                rightIcon,
                                                variant = 'default',
                                                inputSize = 'md',
                                                className = '',
                                                style = {},
                                                disabled,
                                                id,
                                                // CHANGED: Destructure 'as' and 'children'
                                                as: Component = 'input',
                                                children,
                                                ...props
                                            }) => {
    const {currentTheme} = useTheme();
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            default: {
                backgroundColor: colors.background.primary,
                borderColor: error ? colors.status.error : colors.border.primary,
                focusBorderColor: error ? colors.status.error : colors.border.focus,
            },
            filled: {
                backgroundColor: colors.background.secondary,
                borderColor: 'transparent',
                focusBorderColor: error ? colors.status.error : colors.border.focus,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderColor: error ? colors.status.error : colors.border.primary,
                focusBorderColor: error ? colors.status.error : colors.border.focus,
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

        return sizes[inputSize];
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const inputStyles: React.CSSProperties = {
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        color: currentTheme.colors.text.primary,
        fontSize: sizeStyles.fontSize,
        fontFamily: currentTheme.typography.fontFamily.sans,
        borderRadius: currentTheme.borderRadius.md,
        border: '1px solid',
        width: '100%',
        height: sizeStyles.height,
        transition: 'all 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        paddingLeft: leftIcon ? currentTheme.spacing.xl : sizeStyles.padding.split(' ')[1],
        paddingRight: rightIcon ? currentTheme.spacing.xl : sizeStyles.padding.split(' ')[1],
        paddingTop: sizeStyles.padding.split(' ')[0],
        paddingBottom: sizeStyles.padding.split(' ')[0],
        ...style,
    };

    const focusStyles = {
        borderColor: variantStyles.focusBorderColor,
        boxShadow: `0 0 0 3px ${variantStyles.focusBorderColor}20`,
    };

    const labelStyles: React.CSSProperties = {
        color: currentTheme.colors.text.primary,
        fontSize: currentTheme.typography.fontSize.sm,
        fontWeight: currentTheme.typography.fontWeight.medium,
        fontFamily: currentTheme.typography.fontFamily.sans,
        marginBottom: currentTheme.spacing.xs,
        display: 'block',
    };

    const helperTextStyles: React.CSSProperties = {
        color: error ? currentTheme.colors.status.error : currentTheme.colors.text.tertiary,
        fontSize: currentTheme.typography.fontSize.sm,
        fontFamily: currentTheme.typography.fontFamily.sans,
        marginTop: currentTheme.spacing.xs,
    };

    return (
        <div className={`ui-input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} style={labelStyles}>
                    {label}
                    {props.required && <span style={{color: currentTheme.colors.status.error}}> *</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                        style={{color: currentTheme.colors.text.tertiary}}
                    >
                        {leftIcon}
                    </div>
                )}

                {/* CHANGED: This now dynamically renders input, textarea, or select */}
                <Component
                    id={inputId}
                    style={inputStyles}
                    className="ui-input"
                    disabled={disabled}
                    onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                    onBlur={(e) => {
                        e.target.style.borderColor = variantStyles.borderColor;
                        e.target.style.boxShadow = 'none';
                    }}
                    {...props}
                >
                    {/* Only pass children if the component is a select, preventing the error */}
                    {children}
                </Component>

                {rightIcon && (
                    <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{color: currentTheme.colors.text.tertiary}}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <p style={helperTextStyles}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};