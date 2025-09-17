// src/components/Footer.tsx

import React from 'react';
import {Facebook, Linkedin, Twitter} from 'lucide-react';
import {useTheme} from '../contexts/ThemeContext';

// A small helper component to handle hover effects on theme-aware links
const ThemedLink = ({href, children}: { href: string, children: React.ReactNode }) => {
    const {currentTheme} = useTheme();

    const style: React.CSSProperties = {
        color: currentTheme.colors.text.tertiary,
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = currentTheme.colors.text.primary;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.color = currentTheme.colors.text.tertiary;
    };

    return (
        <a href={href} style={style} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
        </a>
    );
};


export const Footer: React.FC = () => {
    const {currentTheme} = useTheme();

    // Define style objects based on the theme for a cleaner JSX structure
    const footerStyles: React.CSSProperties = {
        backgroundColor: currentTheme.colors.background.primary,
        borderTop: `1px solid ${currentTheme.colors.border.primary}`,
    };

    const containerStyles: React.CSSProperties = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: `${currentTheme.spacing.xl} ${currentTheme.spacing.lg}`,
    };

    const gridStyles: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
        gap: currentTheme.spacing.xl,
        textAlign: 'center', // Default alignment for mobile
    };

    // Media query could be used here for more complex layouts, but this works for simple cases
    // For this example, we'll let the grid handle responsiveness and align the first item left on larger screens if needed.

    const sectionStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content in each grid cell
    };

    const sectionTitleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.sm,
        fontWeight: currentTheme.typography.fontWeight.semibold,
        color: currentTheme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: currentTheme.spacing.md,
    };

    const socialLinkStyles: React.CSSProperties = {
        color: currentTheme.colors.text.tertiary,
        transition: 'color 0.2s ease-in-out',
    };

    const copyrightStyles: React.CSSProperties = {
        color: currentTheme.colors.text.tertiary,
        fontSize: currentTheme.typography.fontSize.sm,
    };

    return (
        <footer style={footerStyles}>
            <div style={containerStyles}>
                <div style={gridStyles}>
                    {/* Legal Links Section */}
                    <div style={{...sectionStyles, alignItems: 'flex-start'}}>
                        <h3 style={sectionTitleStyles}>Legal</h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: currentTheme.spacing.sm,
                            alignItems: 'flex-start'
                        }}>
                            <ThemedLink href="#">Terms of Service</ThemedLink>
                            <ThemedLink href="#">Privacy Policy</ThemedLink>
                            <ThemedLink href="#">Contact Us</ThemedLink>
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div style={sectionStyles}>
                        <h3 style={sectionTitleStyles}>Connect With Us</h3>
                        <div style={{display: 'flex', gap: currentTheme.spacing.md}}>
                            <a
                                href="https://www.linkedin.com/company/hapo-technology/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={socialLinkStyles}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#0077B5'}
                                onMouseLeave={(e) => e.currentTarget.style.color = currentTheme.colors.text.tertiary}
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={24}/>
                            </a>
                            <a
                                href="#"
                                style={socialLinkStyles}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#1DA1F2'}
                                onMouseLeave={(e) => e.currentTarget.style.color = currentTheme.colors.text.tertiary}
                                aria-label="Twitter"
                            >
                                <Twitter size={24}/>
                            </a>
                            <a
                                href="#"
                                style={socialLinkStyles}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#4267B2'}
                                onMouseLeave={(e) => e.currentTarget.style.color = currentTheme.colors.text.tertiary}
                                aria-label="Facebook"
                            >
                                <Facebook size={24}/>
                            </a>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div style={sectionStyles}>
                        <h3 style={sectionTitleStyles}></h3>
                        <p style={copyrightStyles}>© 2025 Hapo Cloud Technologies.</p>
                        <p style={copyrightStyles}>All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};