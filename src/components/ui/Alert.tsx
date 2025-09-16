import React from 'react';
import {AlertCircle, CheckCircle, Info, X, XCircle} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';
import {Button} from './Button';

export interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    showIcon?: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const Alert: React.FC<AlertProps> = ({
                                                variant = 'info',
                                                title,
                                                children,
                                                showIcon = true,
                                                dismissible = false,
                                                onDismiss,
                                                className = '',
                                                style = {},
                                            }) => {
    const {currentTheme} = useTheme();

    const getVariantConfig = () => {
        const {colors} = currentTheme;

        const configs = {
            info: {
                backgroundColor: colors.status.info + '10',
                borderColor: colors.status.info + '30',
                textColor: colors.status.info,
                icon: <Info className="w-5 h-5"/>,
            },
            success: {
                backgroundColor: colors.status.success + '10',
                borderColor: colors.status.success + '30',
                textColor: colors.status.success,
                icon: <CheckCircle className="w-5 h-5"/>,
            },
            warning: {
                backgroundColor: colors.status.warning + '10',
                borderColor: colors.status.warning + '30',
                textColor: colors.status.warning,
                icon: <AlertCircle className="w-5 h-5"/>,
            },
            error: {
                backgroundColor: colors.status.error + '10',
                borderColor: colors.status.error + '30',
                textColor: colors.status.error,
                icon: <XCircle className="w-5 h-5"/>,
            },
        };

        return configs[variant];
    };

    const config = getVariantConfig();

    const alertStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: currentTheme.spacing.md,
        padding: currentTheme.spacing.lg,
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: currentTheme.borderRadius.lg,
        fontFamily: currentTheme.typography.fontFamily.sans,
        ...style,
    };

    const contentStyles: React.CSSProperties = {
        flex: 1,
        minWidth: 0,
    };

    const titleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.base,
        fontWeight: currentTheme.typography.fontWeight.semibold,
        color: config.textColor,
        marginBottom: title ? currentTheme.spacing.xs : 0,
    };

    const messageStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.sm,
        color: currentTheme.colors.text.primary,
        lineHeight: currentTheme.typography.lineHeight.relaxed,
    };

    return (
        <div
            style={alertStyles}
            className={`ui-alert ui-alert--${variant} ${className}`}
            role="alert"
        >
            {showIcon && (
                <div style={{color: config.textColor, flexShrink: 0}}>
                    {config.icon}
                </div>
            )}

            <div style={contentStyles}>
                {title && (
                    <div style={titleStyles} className="ui-alert-title">
                        {title}
                    </div>
                )}
                <div style={messageStyles} className="ui-alert-message">
                    {children}
                </div>
            </div>

            {dismissible && onDismiss && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="ui-alert-dismiss"
                >
                    <X className="w-4 h-4"/>
                </Button>
            )}
        </div>
    );
};