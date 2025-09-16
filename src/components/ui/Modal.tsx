import React, {useEffect} from 'react';
import {X} from 'lucide-react';
import {useTheme} from '../../contexts/ThemeContext';
import {Button} from './Button';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                size = 'md',
                                                showCloseButton = true,
                                                closeOnOverlayClick = true,
                                                className = '',
                                            }) => {
    const {currentTheme} = useTheme();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeStyles = () => {
        const sizes = {
            sm: {maxWidth: '24rem', width: '100%'},
            md: {maxWidth: '32rem', width: '100%'},
            lg: {maxWidth: '48rem', width: '100%'},
            xl: {maxWidth: '64rem', width: '100%'},
            full: {maxWidth: '95vw', width: '100%', height: '95vh'},
        };

        return sizes[size];
    };

    const overlayStyles: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: currentTheme.spacing.md,
        zIndex: 50,
        backdropFilter: 'blur(4px)',
    };

    const modalStyles: React.CSSProperties = {
        backgroundColor: currentTheme.colors.background.primary,
        borderRadius: currentTheme.borderRadius.lg,
        boxShadow: currentTheme.shadows.xl,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflow: 'hidden',
        ...getSizeStyles(),
    };

    const headerStyles: React.CSSProperties = {
        padding: currentTheme.spacing.lg,
        borderBottom: `1px solid ${currentTheme.colors.border.primary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const titleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.xl,
        fontWeight: currentTheme.typography.fontWeight.semibold,
        color: currentTheme.colors.text.primary,
        fontFamily: currentTheme.typography.fontFamily.sans,
        margin: 0,
    };

    const contentStyles: React.CSSProperties = {
        padding: currentTheme.spacing.lg,
        flex: 1,
        overflowY: 'auto',
    };

    return (
        <div
            style={overlayStyles}
            className="ui-modal-overlay"
            onClick={closeOnOverlayClick ? onClose : undefined}
        >
            <div
                style={modalStyles}
                className={`ui-modal ui-modal--${size} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showCloseButton) && (
                    <div style={headerStyles} className="ui-modal-header">
                        {title && <h2 style={titleStyles}>{title}</h2>}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="ui-modal-close"
                            >
                                <X className="w-5 h-5"/>
                            </Button>
                        )}
                    </div>
                )}

                <div style={contentStyles} className="ui-modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({children, className = ''}) => {
    const {currentTheme} = useTheme();

    const headerStyles: React.CSSProperties = {
        padding: `${currentTheme.spacing.lg} ${currentTheme.spacing.lg} 0`,
        marginBottom: currentTheme.spacing.md,
    };

    return (
        <div style={headerStyles} className={`ui-modal-header ${className}`}>
            {children}
        </div>
    );
};

export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({children, className = ''}) => {
    const {currentTheme} = useTheme();

    const footerStyles: React.CSSProperties = {
        padding: `0 ${currentTheme.spacing.lg} ${currentTheme.spacing.lg}`,
        marginTop: currentTheme.spacing.md,
        borderTop: `1px solid ${currentTheme.colors.border.primary}`,
        paddingTop: currentTheme.spacing.lg,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: currentTheme.spacing.md,
    };

    return (
        <div style={footerStyles} className={`ui-modal-footer ${className}`}>
            {children}
        </div>
    );
};