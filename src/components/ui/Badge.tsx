// src/components/ui/Badge.tsx

import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';

export interface BadgeProps {
    children: React.ReactNode;
    // CHANGED: Added 'purple' to the list of available variants
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
                                                children,
                                                variant = 'default',
                                                size = 'md',
                                                className = '',
                                                style = {},
                                            }) => {
    const {currentTheme} = useTheme();

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            default: {
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
            },
            primary: {
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary,
            },
            secondary: {
                backgroundColor: colors.interactive.secondary,
                color: colors.text.primary,
            },
            success: {
                backgroundColor: colors.status.success + '20',
                color: colors.status.success,
            },
            warning: {
                backgroundColor: colors.status.warning + '20',
                color: colors.status.warning,
            },
            error: {
                backgroundColor: colors.status.error + '20',
                color: colors.status.error,
            },
            info: {
                backgroundColor: colors.status.info + '20',
                color: colors.status.info,
            },
            // CHANGED: Added a style definition for the new 'purple' variant
            purple: {
                backgroundColor: colors.status.extra ? colors.status.extra + '20' : colors.background.secondary,
                color: colors.status.extra || colors.text.primary,
            },
        };

        return variants[variant];
    };

    const getSizeStyles = () => {
        const {spacing, typography} = currentTheme;

        const sizes = {
            sm: {
                padding: `${spacing.xs} ${spacing.sm}`,
                fontSize: typography.fontSize.xs,
            },
            md: {
                padding: `${spacing.xs} ${spacing.md}`,
                fontSize: typography.fontSize.sm,
            },
            lg: {
                padding: `${spacing.sm} ${spacing.lg}`,
                fontSize: typography.fontSize.base,
            },
        };

        return sizes[size];
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const badgeStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: currentTheme.typography.fontFamily.sans,
        fontWeight: currentTheme.typography.fontWeight.medium,
        borderRadius: currentTheme.borderRadius.full,
        whiteSpace: 'nowrap',
        ...sizeStyles,
        ...variantStyles,
        ...style,
    };

    return (
        <span
            style={badgeStyles}
            className={`ui-badge ui-badge--${variant} ui-badge--${size} ${className}`}
        >
      {children}
    </span>
    );
};