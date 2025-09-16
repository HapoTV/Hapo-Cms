// src/contexts/ThemeContext.tsx

import React, {createContext, useContext, useEffect, useState} from 'react';

export type ThemeVariant = 'light' | 'dark' | 'blue' | 'purple' | 'green';

export interface ThemeColors {
    // Background colors
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
        elevated: string;
    };

    // Text colors
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
    };

    // Brand colors
    brand: {
        primary: string;
        secondary: string;
        accent: string;
    };

    // Status colors
    status: {
        success: string;
        warning: string;
        error: string;
        info: string;
        extra?: string;
    };

    // Interactive colors
    interactive: {
        primary: string;
        primaryHover: string;
        secondary: string;
        secondaryHover: string;
        disabled: string;
    };

    // Border colors
    border: {
        primary: string;
        secondary: string;
        focus: string;
    };
}

export interface Theme {
    name: string;
    variant: ThemeVariant;
    colors: ThemeColors;
    typography: {
        fontFamily: {
            sans: string;
            mono: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
        };
        fontWeight: {
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
        };
        lineHeight: {
            tight: string;
            normal: string;
            relaxed: string;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}

// Theme definitions
const baseTheme = {
    typography: {
        fontFamily: {
            sans: 'Inter, system-ui, -apple-system, sans-serif',
            mono: 'JetBrains Mono, Consolas, monospace',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.75',
        },
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
};

export const themes: Record<ThemeVariant, Theme> = {
    light: {
        name: 'Light',
        variant: 'light',
        colors: {
            background: {
                primary: '#ffffff',
                secondary: '#f8fafc',
                tertiary: '#f1f5f9',
                elevated: '#ffffff',
            },
            text: {
                primary: '#0f172a',
                secondary: '#475569',
                tertiary: '#64748b',
                inverse: '#ffffff',
            },
            brand: {
                primary: '#3b82f6',
                secondary: '#1e40af',
                accent: '#06b6d4',
            },
            status: {
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                extra: '#5b21b6',
            },
            interactive: {
                primary: '#3b82f6',
                primaryHover: '#2563eb',
                secondary: '#e2e8f0',
                secondaryHover: '#cbd5e1',
                disabled: '#94a3b8',
            },
            border: {
                primary: '#e2e8f0',
                secondary: '#cbd5e1',
                focus: '#3b82f6',
            },
        },
        ...baseTheme,
    },

    dark: {
        name: 'Dark',
        variant: 'dark',
        colors: {
            background: {
                primary: '#0f172a',
                secondary: '#1e293b',
                tertiary: '#334155',
                elevated: '#1e293b',
            },
            text: {
                primary: '#f8fafc',
                secondary: '#cbd5e1',
                tertiary: '#94a3b8',
                inverse: '#0f172a',
            },
            brand: {
                primary: '#60a5fa',
                secondary: '#3b82f6',
                accent: '#22d3ee',
            },
            status: {
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                info: '#60a5fa',
                extra: '#a78bfa',
            },
            interactive: {
                primary: '#60a5fa',
                primaryHover: '#3b82f6',
                secondary: '#374151',
                secondaryHover: '#4b5563',
                disabled: '#6b7280',
            },
            border: {
                primary: '#374151',
                secondary: '#4b5563',
                focus: '#60a5fa',
            },
        },
        ...baseTheme,
    },

    blue: {
        name: 'Ocean Blue',
        variant: 'blue',
        colors: {
            background: {
                primary: '#f0f9ff',
                secondary: '#e0f2fe',
                tertiary: '#bae6fd',
                elevated: '#ffffff',
            },
            text: {
                primary: '#0c4a6e',
                secondary: '#075985',
                tertiary: '#0369a1',
                inverse: '#ffffff',
            },
            brand: {
                primary: '#0284c7',
                secondary: '#0369a1',
                accent: '#06b6d4',
            },
            status: {
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                info: '#0284c7',
                extra: '#5b21b6',
            },
            interactive: {
                primary: '#0284c7',
                primaryHover: '#0369a1',
                secondary: '#bae6fd',
                secondaryHover: '#7dd3fc',
                disabled: '#94a3b8',
            },
            border: {
                primary: '#bae6fd',
                secondary: '#7dd3fc',
                focus: '#0284c7',
            },
        },
        ...baseTheme,
    },

    purple: {
        name: 'Royal Purple',
        variant: 'purple',
        colors: {
            background: {
                primary: '#faf5ff',
                secondary: '#f3e8ff',
                tertiary: '#e9d5ff',
                elevated: '#ffffff',
            },
            text: {
                primary: '#581c87',
                secondary: '#7c3aed',
                tertiary: '#8b5cf6',
                inverse: '#ffffff',
            },
            brand: {
                primary: '#7c3aed',
                secondary: '#6d28d9',
                accent: '#a855f7',
            },
            status: {
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                info: '#7c3aed',
                extra: '#5b21b6',
            },
            interactive: {
                primary: '#7c3aed',
                primaryHover: '#6d28d9',
                secondary: '#e9d5ff',
                secondaryHover: '#ddd6fe',
                disabled: '#94a3b8',
            },
            border: {
                primary: '#e9d5ff',
                secondary: '#ddd6fe',
                focus: '#7c3aed',
            },
        },
        ...baseTheme,
    },

    green: {
        name: 'Forest Green',
        variant: 'green',
        colors: {
            background: {
                primary: '#f0fdf4',
                secondary: '#dcfce7',
                tertiary: '#bbf7d0',
                elevated: '#ffffff',
            },
            text: {
                primary: '#14532d',
                secondary: '#166534',
                tertiary: '#15803d',
                inverse: '#ffffff',
            },
            brand: {
                primary: '#16a34a',
                secondary: '#15803d',
                accent: '#22c55e',
            },
            status: {
                success: '#16a34a',
                warning: '#d97706',
                error: '#dc2626',
                info: '#0284c7',
                extra: '#09dac2',
            },
            interactive: {
                primary: '#16a34a',
                primaryHover: '#15803d',
                secondary: '#bbf7d0',
                secondaryHover: '#86efac',
                disabled: '#94a3b8',
            },
            border: {
                primary: '#bbf7d0',
                secondary: '#86efac',
                focus: '#16a34a',
            },
        },
        ...baseTheme,
    },
};

interface ThemeContextType {
    currentTheme: Theme;
    themeVariant: ThemeVariant;
    setTheme: (variant: ThemeVariant) => void;
    availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const [themeVariant, setThemeVariant] = useState<ThemeVariant>(() => {
        // Load saved theme from localStorage or default to light
        const saved = localStorage.getItem('hapo-theme');
        // Type-safe check: ensure the saved value is a valid theme key
        if (saved && (Object.keys(themes) as ThemeVariant[]).includes(saved as ThemeVariant)) {
            return saved as ThemeVariant;
        }
        return 'light';
    });

    const setTheme = (variant: ThemeVariant) => {
        setThemeVariant(variant);
        localStorage.setItem('hapo-theme', variant);

        // Apply CSS custom properties to document root
        const theme = themes[variant];
        const root = document.documentElement;

        // Apply color variables
        Object.entries(theme.colors).forEach(([category, colors]) => {
            Object.entries(colors).forEach(([name, value]) => {
                // CORRECTED: Add a check to ensure value is not undefined before setting the property.
                if (value) {
                    root.style.setProperty(`--color-${category}-${name}`, value);
                }
            });
        });

        // Apply typography variables
        Object.entries(theme.typography).forEach(([category, values]) => {
            Object.entries(values).forEach(([name, value]) => {
                if (value) {
                    root.style.setProperty(`--typography-${category}-${name}`, value);
                }
            });
        });

        // Apply spacing variables
        Object.entries(theme.spacing).forEach(([name, value]) => {
            if (value) {
                root.style.setProperty(`--spacing-${name}`, value);
            }
        });

        // Apply border radius variables
        Object.entries(theme.borderRadius).forEach(([name, value]) => {
            if (value) {
                root.style.setProperty(`--radius-${name}`, value);
            }
        });

        // Apply shadow variables
        Object.entries(theme.shadows).forEach(([name, value]) => {
            if (value) {
                root.style.setProperty(`--shadow-${name}`, value);
            }
        });

        // Set theme variant class on body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${variant}`);
    };

    // Initialize theme on mount
    useEffect(() => {
        setTheme(themeVariant);
    }, [themeVariant]); // It's slightly better practice to include the dependency here

    const value: ThemeContextType = {
        currentTheme: themes[themeVariant],
        themeVariant,
        setTheme,
        availableThemes: Object.values(themes),
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};