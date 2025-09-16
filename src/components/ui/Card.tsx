import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    elevated?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    style?: React.CSSProperties;
    variant?: 'default' | 'outlined' | 'filled';
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className = '',
                                              elevated = false,
                                              padding = 'md',
                                              variant = 'default',
                                              hover = false,
                                              style = {},
                                              onClick,
                                          }) => {
    const {currentTheme} = useTheme();

    const getPaddingStyles = () => {
        const {spacing} = currentTheme;

        const paddings = {
            none: '0',
            sm: spacing.md,
            md: spacing.lg,
            lg: spacing.xl,
            xl: spacing['2xl'],
        };

        return {padding: paddings[padding]};
    };

    const getVariantStyles = () => {
        const {colors} = currentTheme;

        const variants = {
            default: {
                backgroundColor: elevated ? colors.background.elevated : colors.background.primary,
                borderColor: colors.border.primary,
                border: '1px solid',
            },
            outlined: {
                backgroundColor: 'transparent',
                borderColor: colors.border.primary,
                border: '1px solid',
            },
            filled: {
                backgroundColor: colors.background.secondary,
                borderColor: 'transparent',
                border: '1px solid transparent',
            },
        };

        return variants[variant];
    };

    const variantStyles = getVariantStyles();
    const paddingStyles = getPaddingStyles();

    const cardStyles: React.CSSProperties = {
        borderRadius: currentTheme.borderRadius.lg,
        boxShadow: elevated ? currentTheme.shadows.md : currentTheme.shadows.sm,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...variantStyles,
        ...paddingStyles,
        ...style,
    };

    const hoverStyles = hover ? {
        transform: 'translateY(-2px)',
        boxShadow: currentTheme.shadows.lg,
    } : {};

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hover || onClick) {
            Object.assign(e.currentTarget.style, hoverStyles);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hover || onClick) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = elevated ? currentTheme.shadows.md : currentTheme.shadows.sm;
        }
    };

    return (
        <div
            style={cardStyles}
            className={`ui-card ui-card--${variant} ${onClick ? 'ui-card--clickable' : ''} ${className}`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};