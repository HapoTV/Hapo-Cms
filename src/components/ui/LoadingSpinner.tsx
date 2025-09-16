import React from 'react';
import {Loader2} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';

export interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    className?: string;
    style?: React.CSSProperties;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                                  size = 'md',
                                                                  color = 'primary',
                                                                  className = '',
                                                                  style = {},
                                                              }) => {
    const {currentTheme} = useTheme();

    const getSizeStyles = () => {
        const sizes = {
            xs: {width: '1rem', height: '1rem'},
            sm: {width: '1.25rem', height: '1.25rem'},
            md: {width: '1.5rem', height: '1.5rem'},
            lg: {width: '2rem', height: '2rem'},
            xl: {width: '3rem', height: '3rem'},
        };

        return sizes[size];
    };

    const getColorStyles = () => {
        const {colors} = currentTheme;

        const colorMap = {
            primary: colors.brand.primary,
            secondary: colors.text.secondary,
            success: colors.status.success,
            warning: colors.status.warning,
            error: colors.status.error,
        };

        return {color: colorMap[color]};
    };

    const sizeStyles = getSizeStyles();
    const colorStyles = getColorStyles();

    const spinnerStyles: React.CSSProperties = {
        ...sizeStyles,
        ...colorStyles,
        ...style,
    };

    return (
        <Loader2
            style={spinnerStyles}
            className={`ui-loading-spinner animate-spin ${className}`}
        />
    );
};

export interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    size?: LoadingSpinnerProps['size'];
    className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
                                                                  isLoading,
                                                                  message = 'Loading...',
                                                                  size = 'lg',
                                                                  className = '',
                                                              }) => {
    const {currentTheme} = useTheme();

    if (!isLoading) return null;

    const overlayStyles: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        backgroundColor: currentTheme.colors.background.primary + 'E6', // 90% opacity
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentTheme.spacing.md,
        zIndex: 40,
        backdropFilter: 'blur(2px)',
    };

    const messageStyles: React.CSSProperties = {
        color: currentTheme.colors.text.primary,
        fontSize: currentTheme.typography.fontSize.base,
        fontFamily: currentTheme.typography.fontFamily.sans,
        fontWeight: currentTheme.typography.fontWeight.medium,
    };

    return (
        <div style={overlayStyles} className={`ui-loading-overlay ${className}`}>
            <LoadingSpinner size={size}/>
            <p style={messageStyles}>{message}</p>
        </div>
    );
};