// src/components/ui/Input.tsx

import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';
// It's good practice to allow optional connection to react-hook-form
import {useFormContext} from 'react-hook-form';

type AllInputProps = React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>;

// 1. ADDED FLEXIBILITY: Add 'checkbox' and 'range' to the 'as' prop type definition
export interface InputProps extends AllInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled' | 'outlined';
    inputSize?: 'sm' | 'md' | 'lg';
    as?: 'input' | 'textarea' | 'select' | 'checkbox' | 'range';
    children?: React.ReactNode;
    name?: string; // name is crucial for many form libraries
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error: propError,
                                                helperText,
                                                leftIcon,
                                                rightIcon,
                                                variant = 'default',
                                                inputSize = 'md',
                                                className = '',
                                                style = {},
                                                disabled,
                                                id,
                                                as: Component = 'input',
                                                children,
                                                name,
                                                ...props
                                            }) => {
    const {currentTheme} = useTheme();
    const formCtx = useFormContext();

    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Gracefully handle form state if react-hook-form is used
    const registerProps = formCtx && name ? formCtx.register(name) : {};
    const formError = formCtx && name ? formCtx.formState.errors[name]?.message : undefined;
    const error = propError || (formError as string | undefined);

    // 2. CORRECTED: Style functions are defined here, outside the main return statement.
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
                fontSize: typography.fontSize.sm, height: '2rem'
            },
            md: {
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: typography.fontSize.base,
                height: '2.5rem'
            },
            lg: {
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.lg,
                height: '3rem'
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
        fontWeight: 500,
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

    // 3. ADDED FLEXIBILITY: Conditional rendering for the 'checkbox' type
    if (Component === 'checkbox') {
        const checkboxWrapperStyles: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: currentTheme.spacing.sm,
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: `${currentTheme.spacing.xs} 0`
        };
        const checkboxInputStyles: React.CSSProperties = {
            height: '1rem',
            width: '1rem',
            flexShrink: 0,
            accentColor: currentTheme.colors.brand.primary
        };

        const checkboxLabelContainerStyles: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'column'
        };

        const checkboxLabelStyles: React.CSSProperties = {
            color: currentTheme.colors.text.primary,
            fontSize: currentTheme.typography.fontSize.sm,
            fontWeight: 500
        };

        const checkboxHelperTextStyles: React.CSSProperties = {
            fontSize: currentTheme.typography.fontSize.xs,
            color: currentTheme.colors.text.tertiary
        };

        return (
            <div className={`ui-checkbox-wrapper ${className}`} style={{opacity: disabled ? 0.6 : 1}}>
                <label htmlFor={inputId} style={checkboxWrapperStyles}>
                    <input
                        type="checkbox"
                        id={inputId}
                        disabled={disabled}
                        style={checkboxInputStyles}
                        {...registerProps}
                        {...props}
                    />
                    <div style={checkboxLabelContainerStyles}>
                        {label && <span style={checkboxLabelStyles}>{label}</span>}
                        {helperText && <span style={checkboxHelperTextStyles}>{helperText}</span>}
                    </div>
                </label>
                {error && <p style={helperTextStyles}>{error}</p>}
            </div>
        );
    }

    // 4. ADDED FLEXIBILITY: Conditional rendering for the 'range' type
    if (Component === 'range') {
        return (
            <div className={`ui-range-wrapper ${className}`}>
                {label &&
                    <label
                        htmlFor={inputId}
                        style={labelStyles}>
                        {label}
                    </label>}
                <input
                    type="range"
                    id={inputId}
                    disabled={disabled}
                    style={{width: '100%', accentColor: currentTheme.colors.brand.primary}}
                    {...registerProps}
                    {...props}
                />
                {(error || helperText) && <p style={helperTextStyles}>{error || helperText}</p>}
            </div>
        )
    }

    // Original renderer for 'input', 'textarea', 'select'
    return (
        <div className={`ui-input-wrapper ${className}`}>
            {label && <label htmlFor={inputId} style={labelStyles}>
                {label}{props.required &&
                <span style={{color: currentTheme.colors.status.error}}>*</span>}
            </label>}
            <div style={{position: 'relative'}}>
                {leftIcon && <div style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: currentTheme.colors.text.tertiary
                }}>{leftIcon}</div>}

                <Component
                    id={inputId}
                    style={{
                        ...inputStyles,
                        borderColor: error ? currentTheme.colors.status.error : inputStyles.borderColor
                    }}
                    disabled={disabled}
                    onFocus={(e) => Object.assign(e.target.style, focusStyles)}
                    onBlur={(e) => {
                        e.target.style.borderColor = variantStyles.borderColor;
                        e.target.style.boxShadow = 'none';
                    }}
                    {...registerProps}
                    {...props}
                >
                    {children}
                </Component>

                {rightIcon && <div
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}>
                    {rightIcon}
                </div>}
            </div>
            {(error || helperText) &&
                <p style={helperTextStyles}>
                    {error || helperText}
                </p>
            }
        </div>
    );
};