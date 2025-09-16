// src/components/ThemeSelector.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Check, Monitor, Moon, Palette, Sun} from 'lucide-react';
import {type ThemeVariant, useTheme} from '../contexts/ThemeContext';
import {Button} from './ui/Button';
import {Card} from './ui/Card';

export const ThemeSelector: React.FC = () => {
    const {currentTheme, themeVariant, setTheme, availableThemes} = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getThemeIcon = (variant: ThemeVariant) => {
        switch (variant) {
            case 'light':
                return <Sun className="w-4 h-4"/>;
            case 'dark':
                return <Moon className="w-4 h-4"/>;
            default:
                return <Monitor className="w-4 h-4"/>;
        }
    };

    const getThemePreview = (variant: ThemeVariant) => {
        const theme = availableThemes.find(t => t.variant === variant);
        if (!theme) return null;

        return (
            <div className="flex gap-1">
                <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                        backgroundColor: theme.colors.brand.primary,
                        borderColor: theme.colors.border.secondary
                    }}
                />
                <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.secondary
                    }}
                />
                <div
                    className="w-3 h-3 rounded-full border"
                    style={{
                        backgroundColor: theme.colors.text.primary,
                        borderColor: theme.colors.border.secondary
                    }}
                />
            </div>
        );
    };

    return (
        <div className="relative" ref={containerRef}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                leftIcon={<Palette className="w-4 h-4"/>}
            >
                <div className="flex items-center gap-2">
                    <span>Theme</span>
                    {getThemePreview(themeVariant)}
                </div>
            </Button>

            {isOpen && (
                <Card
                    elevated
                    padding="none"
                    className="absolute right-0 mt-2 w-64 z-50 overflow-hidden"
                >
                    <div
                        className="p-3 border-b"
                        style={{borderColor: currentTheme.colors.border.primary}}
                    >
                        <h3
                            className="text-sm font-semibold"
                            style={{color: currentTheme.colors.text.primary}}
                        >
                            Choose Theme
                        </h3>
                        <p
                            className="text-xs mt-1"
                            style={{color: currentTheme.colors.text.tertiary}}
                        >
                            Select your preferred appearance
                        </p>
                    </div>

                    <div className="p-2">
                        {availableThemes.map((theme) => (
                            <Button
                                key={theme.variant}
                                variant={themeVariant === theme.variant ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => {
                                    setTheme(theme.variant);
                                    setIsOpen(false);
                                }}
                                // This className now correctly arranges the content inside
                                className="w-full flex items-center justify-between"
                            >
                                {/* This div groups the icon, name, and preview together on the left */}
                                <div className="flex items-center gap-3">
                                    {getThemeIcon(theme.variant)}
                                    <span className="font-medium">{theme.name}</span>
                                    {getThemePreview(theme.variant)}
                                </div>

                                {/* The Check icon is now the second child, pushed to the right by justify-between */}
                                {themeVariant === theme.variant && (
                                    <Check
                                        className="w-4 h-4"
                                        style={{color: currentTheme.colors.brand.primary}}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>

                    <div
                        className="p-3 border-t text-center"
                        style={{borderColor: currentTheme.colors.border.primary}}
                    >
                        <p
                            className="text-xs"
                            style={{color: currentTheme.colors.text.tertiary}}
                        >
                            Theme preference is saved automatically
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
};