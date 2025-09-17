// src/features/screens/views/ScreenCreateView.tsx

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
import {ScreenFormContainer} from '../components/ScreenForm/ScreenFormContainer';
import {screensService} from '../../../services/screens.service';

// 1. Import the themed Button component and the useTheme hook
import {Button} from '../../../components/ui';
import {useTheme} from '../../../contexts/ThemeContext';

export const ScreenCreateView = () => {
    const navigate = useNavigate();
    const {currentTheme} = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateScreen = async (payload: import('../../../types').ScreenCreation) => {
        setIsSubmitting(true);
        try {
            await screensService.createScreenFromCode(payload);

            // Notify user of success (optional but good practice)
            // toast.success('Screen created successfully!');

            navigate('/screens');
        } catch (error) {
            console.error("Failed to create screen:", error);
            // Provide more specific feedback to the user if possible
            // For example, if the API returns a specific error message
            // methods.setError('root.serverError', { type: 'custom', message: 'Failed to create screen.' });
            alert('Failed to create screen. Please check the details and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2. Define style objects using the theme for a cleaner and more maintainable JSX structure
    const viewContainerStyles: React.CSSProperties = {
        // Corresponds to p-4 md:p-8 max-w-6xl mx-auto
        padding: currentTheme.spacing.xl,
        maxWidth: '1152px', // max-w-6xl
        margin: '0 auto',
    };

    const headerStyles: React.CSSProperties = {
        // Corresponds to text-2xl font-bold text-gray-900 mb-8
        fontSize: currentTheme.typography.fontSize['2xl'],
        fontWeight: currentTheme.typography.fontWeight.bold,
        color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.xl,
    };

    const backButtonStyles: React.CSSProperties = {
        // Corresponds to mb-6
        marginBottom: currentTheme.spacing.lg,
    };

    return (
        <div style={viewContainerStyles}>
            {/* 3. Replace the native button with the themed Button component */}
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                leftIcon={<ChevronLeft size={20}/>}
                style={backButtonStyles}
            >
                Back to Screens
            </Button>

            <h1 style={headerStyles}>Add New Screen</h1>

            <ScreenFormContainer
                onSubmit={handleCreateScreen}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};
