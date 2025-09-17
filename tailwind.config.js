// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
      extend: {
          colors: {
              // Theme-aware colors using CSS variables
              'theme-bg-primary': 'var(--color-background-primary)',
              'theme-bg-secondary': 'var(--color-background-secondary)',
              'theme-bg-tertiary': 'var(--color-background-tertiary)',
              'theme-bg-elevated': 'var(--color-background-elevated)',

              'theme-text-primary': 'var(--color-text-primary)',
              'theme-text-secondary': 'var(--color-text-secondary)',
              'theme-text-tertiary': 'var(--color-text-tertiary)',
              'theme-text-inverse': 'var(--color-text-inverse)',

              'theme-brand-primary': 'var(--color-brand-primary)',
              'theme-brand-secondary': 'var(--color-brand-secondary)',
              'theme-brand-accent': 'var(--color-brand-accent)',

              'theme-border-primary': 'var(--color-border-primary)',
              'theme-border-secondary': 'var(--color-border-secondary)',
              'theme-border-focus': 'var(--color-border-focus)',
          },
          fontFamily: {
              'theme-sans': 'var(--typography-fontFamily-sans)',
              'theme-mono': 'var(--typography-fontFamily-mono)',
          },
          spacing: {
              'theme-xs': 'var(--spacing-xs)',
              'theme-sm': 'var(--spacing-sm)',
              'theme-md': 'var(--spacing-md)',
              'theme-lg': 'var(--spacing-lg)',
              'theme-xl': 'var(--spacing-xl)',
              'theme-2xl': 'var(--spacing-2xl)',
              'theme-3xl': 'var(--spacing-3xl)',
          },
          borderRadius: {
              'theme-sm': 'var(--radius-sm)',
              'theme-md': 'var(--radius-md)',
              'theme-lg': 'var(--radius-lg)',
              'theme-xl': 'var(--radius-xl)',
              'theme-full': 'var(--radius-full)',
          },
          boxShadow: {
              'theme-sm': 'var(--shadow-sm)',
              'theme-md': 'var(--shadow-md)',
              'theme-lg': 'var(--shadow-lg)',
              'theme-xl': 'var(--shadow-xl)',
          },
      },
  },
  plugins: [],
};
