import {useTheme as useThemeContext} from '../contexts/ThemeContext';

// Re-export for convenience
export const useTheme = useThemeContext;

// Additional theme utilities
export const useThemeClasses = () => {
    const {currentTheme} = useTheme();

    return {
        // Background classes
        bgPrimary: 'bg-[var(--color-background-primary)]',
        bgSecondary: 'bg-[var(--color-background-secondary)]',
        bgTertiary: 'bg-[var(--color-background-tertiary)]',
        bgElevated: 'bg-[var(--color-background-elevated)]',

        // Text classes
        textPrimary: 'text-[var(--color-text-primary)]',
        textSecondary: 'text-[var(--color-text-secondary)]',
        textTertiary: 'text-[var(--color-text-tertiary)]',
        textInverse: 'text-[var(--color-text-inverse)]',

        // Brand classes
        brandPrimary: 'text-[var(--color-brand-primary)]',
        brandSecondary: 'text-[var(--color-brand-secondary)]',
        brandAccent: 'text-[var(--color-brand-accent)]',

        // Interactive classes
        btnPrimary: 'bg-[var(--color-interactive-primary)] hover:bg-[var(--color-interactive-primaryHover)] text-[var(--color-text-inverse)]',
        btnSecondary: 'bg-[var(--color-interactive-secondary)] hover:bg-[var(--color-interactive-secondaryHover)] text-[var(--color-text-primary)]',

        // Border classes
        borderPrimary: 'border-[var(--color-border-primary)]',
        borderSecondary: 'border-[var(--color-border-secondary)]',
        borderFocus: 'focus:border-[var(--color-border-focus)]',

        // Status classes
        statusSuccess: 'text-[var(--color-status-success)]',
        statusWarning: 'text-[var(--color-status-warning)]',
        statusError: 'text-[var(--color-status-error)]',
        statusInfo: 'text-[var(--color-status-info)]',
    };
};

// CSS-in-JS style generator
export const useThemeStyles = () => {
    const {currentTheme} = useTheme();

    return {
        // Background styles
        backgroundPrimary: {backgroundColor: currentTheme.colors.background.primary},
        backgroundSecondary: {backgroundColor: currentTheme.colors.background.secondary},
        backgroundTertiary: {backgroundColor: currentTheme.colors.background.tertiary},
        backgroundElevated: {backgroundColor: currentTheme.colors.background.elevated},

        // Text styles
        textPrimary: {color: currentTheme.colors.text.primary},
        textSecondary: {color: currentTheme.colors.text.secondary},
        textTertiary: {color: currentTheme.colors.text.tertiary},
        textInverse: {color: currentTheme.colors.text.inverse},

        // Brand styles
        brandPrimary: {color: currentTheme.colors.brand.primary},
        brandSecondary: {color: currentTheme.colors.brand.secondary},
        brandAccent: {color: currentTheme.colors.brand.accent},

        // Border styles
        borderPrimary: {borderColor: currentTheme.colors.border.primary},
        borderSecondary: {borderColor: currentTheme.colors.border.secondary},
        borderFocus: {borderColor: currentTheme.colors.border.focus},
    };
};