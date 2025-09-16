// src/components/ui/Button.tsx

import React from 'react';
import {Loader2} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline' | 'destructive' | 'constructive';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'primary',
                                                  size = 'md',
                                                  loading = false,
                                                  leftIcon,
                                                  rightIcon,
                                                  children,
                                                  className = '',
                                                  disabled,
                                                  ...props
                                              }) => {
    const {currentTheme} = useTheme();

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            primary: {
                backgroundColor: disabled || loading ? colors.interactive.disabled : colors.interactive.primary,
                color: colors.text.inverse,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.interactive.primary,
                hover: !disabled && !loading ? {
                    backgroundColor: colors.interactive.primaryHover,
                    borderColor: colors.interactive.primaryHover
                } : {},
            },
            secondary: {
                backgroundColor: disabled || loading ? colors.interactive.disabled : colors.interactive.secondary,
                color: disabled || loading ? colors.text.tertiary : colors.text.primary,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.border.primary,
                hover: !disabled && !loading ? {
                    backgroundColor: colors.interactive.secondaryHover,
                    borderColor: colors.border.secondary
                } : {},
            },
            success: {
                backgroundColor: disabled || loading ? colors.interactive.disabled : colors.status.success,
                color: colors.text.inverse,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.status.success,
                hover: !disabled && !loading ? {
                    backgroundColor: colors.status.success + 'E6'
                } : {}, // E6 adds slight transparency to darken
            },
            warning: {
                backgroundColor: disabled || loading ? colors.interactive.disabled : colors.status.warning,
                color: colors.text.inverse,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.status.warning,
                // CORRECTED: Added hover property
                hover: !disabled && !loading ? {backgroundColor: colors.status.warning + 'E6'} : {},
            },
            error: {
                backgroundColor: disabled || loading ? colors.interactive.disabled : colors.status.error,
                color: colors.text.inverse,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.status.error,
                // CORRECTED: Added hover property
                hover: !disabled && !loading ? {backgroundColor: colors.status.error + 'E6'} : {},
            },
            ghost: {
                backgroundColor: 'transparent',
                color: 'inherit',
                borderColor: 'transparent',
                hover: !disabled && !loading ? {
                    backgroundColor: colors.background.secondary
                } : {},
            },
            outline: {
                backgroundColor: 'transparent',
                color: disabled || loading ? colors.text.tertiary : colors.brand.primary,
                borderColor: disabled || loading ? colors.interactive.disabled : colors.brand.primary,
                hover: !disabled && !loading ? {
                    backgroundColor: colors.brand.primary,
                    color: colors.text.inverse
                } : {},
            },
            destructive: {
                backgroundColor: 'transparent',
                color: colors.status.error,
                borderColor: 'transparent',
                hover: !disabled && !loading ? {backgroundColor: colors.status.error + '15'} : {},
            },
            constructive: {
                backgroundColor: 'transparent',
                color: colors.status.info, // You can customize this as needed
                borderColor: 'transparent',
                hover: !disabled && !loading ? {backgroundColor: colors.status.info + '15'} : {},
            },
        };

        return variants[variant];
    };

    const getSizeStyles = () => {
        const {spacing, typography} = currentTheme;

        const sizes = {
            xs: {
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.xs,
                gap: spacing.xs
            },
            sm: {
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: typography.fontSize.sm,
                gap: spacing.xs
            },
            md: {
                padding: `${spacing.sm} ${spacing.lg}`,
                fontSize: typography.fontSize.base,
                gap: spacing.sm
            },
            lg: {
                padding: `${spacing.md} ${spacing.xl}`,
                fontSize: typography.fontSize.lg,
                gap: spacing.sm
            },
            xl: {
                padding: `${spacing.lg} ${spacing['2xl']}`,
                fontSize: typography.fontSize.xl,
                gap: spacing.md
            },
        };

        return sizes[size];
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const baseStyles: React.CSSProperties = {
        fontFamily: currentTheme.typography.fontFamily.sans,
        fontWeight: currentTheme.typography.fontWeight.medium,
        border: '1px solid',
        borderRadius: currentTheme.borderRadius.md,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        outline: 'none',
        textDecoration: 'none',
        userSelect: 'none',
        opacity: disabled || loading ? 0.6 : 1,
        ...sizeStyles,
        ...variantStyles,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading && variantStyles.hover) {
            Object.assign(e.currentTarget.style, variantStyles.hover);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !loading) {
            e.currentTarget.style.backgroundColor = variantStyles.backgroundColor;
            e.currentTarget.style.borderColor = variantStyles.borderColor;
            e.currentTarget.style.color = variantStyles.color;
        }
    };

    return (
        <button
            style={baseStyles}
            className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
            disabled={disabled || loading}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {loading &&
                <Loader2 className="animate-spin" style={{width: sizeStyles.fontSize, height: sizeStyles.fontSize}}/>}

            {!loading && (
                <>
                    {leftIcon}
                    {children && <span>{children}</span>}
                    {rightIcon}
                </>
            )}
        </button>
    );
};