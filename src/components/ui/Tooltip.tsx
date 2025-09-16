import React, {useEffect, useRef, useState} from 'react';
import {useTheme} from '../../contexts/ThemeContext';

export interface TooltipProps {
    children: React.ReactNode;
    content: string | React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
    disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
                                                    children,
                                                    content,
                                                    position = 'top',
                                                    delay = 500,
                                                    className = '',
                                                    disabled = false,
                                                }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const {currentTheme} = useTheme();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        if (disabled) return;

        setIsVisible(true);
        timeoutRef.current = setTimeout(() => {
            setShowTooltip(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
        setShowTooltip(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const getPositionStyles = (): React.CSSProperties => {
        const offset = '8px';

        const positions = {
            top: {
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: offset,
            },
            bottom: {
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: offset,
            },
            left: {
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginRight: offset,
            },
            right: {
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                marginLeft: offset,
            },
        };

        return positions[position];
    };

    const getArrowStyles = (): React.CSSProperties => {
        const arrowSize = '4px';
        const arrowColor = currentTheme.colors.background.elevated;

        const arrows = {
            top: {
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: `${arrowSize} solid transparent`,
                borderRight: `${arrowSize} solid transparent`,
                borderTop: `${arrowSize} solid ${arrowColor}`,
            },
            bottom: {
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: `${arrowSize} solid transparent`,
                borderRight: `${arrowSize} solid transparent`,
                borderBottom: `${arrowSize} solid ${arrowColor}`,
            },
            left: {
                left: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: `${arrowSize} solid transparent`,
                borderBottom: `${arrowSize} solid transparent`,
                borderLeft: `${arrowSize} solid ${arrowColor}`,
            },
            right: {
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                borderTop: `${arrowSize} solid transparent`,
                borderBottom: `${arrowSize} solid transparent`,
                borderRight: `${arrowSize} solid ${arrowColor}`,
            },
        };

        return arrows[position];
    };

    const tooltipStyles: React.CSSProperties = {
        position: 'absolute',
        zIndex: 50,
        backgroundColor: currentTheme.colors.background.elevated,
        color: currentTheme.colors.text.primary,
        padding: `${currentTheme.spacing.sm} ${currentTheme.spacing.md}`,
        borderRadius: currentTheme.borderRadius.md,
        fontSize: currentTheme.typography.fontSize.sm,
        fontFamily: currentTheme.typography.fontFamily.sans,
        boxShadow: currentTheme.shadows.lg,
        border: `1px solid ${currentTheme.colors.border.primary}`,
        maxWidth: '200px',
        wordWrap: 'break-word',
        opacity: showTooltip ? 1 : 0,
        visibility: showTooltip ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
        ...getPositionStyles(),
    };

    const arrowStyles: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
        ...getArrowStyles(),
    };

    return (
        <div
            className={`ui-tooltip-wrapper relative inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {isVisible && (
                <div style={tooltipStyles} className="ui-tooltip">
                    {content}
                    <div style={arrowStyles} className="ui-tooltip-arrow"/>
                </div>
            )}
        </div>
    );
};