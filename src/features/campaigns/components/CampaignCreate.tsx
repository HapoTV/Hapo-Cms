// src/features/campaigns/components/CampaignCreate.tsx

import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
import {CampaignForm} from './CampaignForm';
// 1. Import the Logo component from your UI library
import {Button, Logo} from '../../../components/ui';
import {useTheme} from '../../../contexts/ThemeContext';

export const CampaignCreate = () => {
  const navigate = useNavigate();
    const {currentTheme} = useTheme();

    // Define style objects using the theme for a cleaner JSX structure
    const containerStyles: React.CSSProperties = {
        padding: currentTheme.spacing.xl,
        maxWidth: '768px',
        margin: '0 auto',
    };

    const logoContainerStyles: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: currentTheme.spacing.lg,
    };

    const logoStyles: React.CSSProperties = {
        height: '48px', // Set a specific height for the logo
        color: currentTheme.colors.brand.primary, // The SVG will inherit this color
    };

    const backButtonStyles: React.CSSProperties = {
        marginBottom: currentTheme.spacing.lg,
    };

    const titleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize['3xl'],
        fontWeight: currentTheme.typography.fontWeight.bold,
        color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.xl,
        textAlign: 'center', // Centering the title to match the logo
    };

  return (
      // 2. Apply the theme-based styles to the elements.
      <div style={containerStyles}>
          {/* 2. Add the Logo component at the top */}
          <div style={logoContainerStyles}>
              <Logo style={logoStyles}/>
          </div>

          <Button
              variant="ghost"
              onClick={() => navigate(-1)} // navigate(-1) is a robust way to go back
              leftIcon={<ChevronLeft size={20}/>}
              style={backButtonStyles}
      >
        Back to Campaigns
          </Button>

          <h1 style={titleStyles}>
              Create New Campaign
          </h1>

      <CampaignForm
        onSubmit={async (data) => {
            // In a real app, you would have your API call here
            console.log('Campaign data submitted:', data);
            // Navigate back to the campaign list on success
            navigate(-1);
        }}
      />
    </div>
  );
};