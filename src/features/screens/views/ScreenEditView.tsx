// src/features/screens/views/ScreenEditView.tsx

import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
import {ScreenFormContainer} from '../components/ScreenForm/ScreenFormContainer';
import {screensService} from '../../../services/screens.service';
import {useScreen} from '../hooks/useScreen';

// 1. Import themed components and the theme hook
import {Alert, Button, LoadingSpinner} from '../../../components/ui';
import {useTheme} from '../../../contexts/ThemeContext';

export const ScreenEditView = () => {
    const navigate = useNavigate();
    const {currentTheme} = useTheme();
    const {id} = useParams<{ id: string }>();

    // 2. CORRECTED: Use the 'id' string directly. No conversion to number is needed for UUIDs.
    const {screen, isLoading, error} = useScreen(id);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdateScreen = async (payload: any) => { // Use 'any' or a more specific update payload type
        if (!id) return; // Guard against missing ID
        setIsSubmitting(true);
        try {
            await screensService.updateScreen(id, payload);
            navigate(`/screens/${id}`);
        } catch (error) {
            console.error("Failed to update screen:", error);
            alert('Failed to update screen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Refactor loading and error states to use themed components
    if (isLoading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
                <LoadingSpinner size="xl"/>
            </div>
        );
    }

    // 3. Handle error state
    if (error) {
        return (
            <div style={{padding: currentTheme.spacing.xl}}>
                <Alert variant="error" title="Failed to load data">{error}</Alert>
            </div>
        );
    }

    // Handle case where screen is not found after loading
    if (!screen) {
        return (
            <div style={{padding: currentTheme.spacing.xl}}>
                <Alert variant="warning" title="Not Found">Screen not found.</Alert>
            </div>
        );
    }

    // 4. Define style objects from the theme for a clean JSX structure
    const viewContainerStyles: React.CSSProperties = {
        padding: currentTheme.spacing.xl,
        maxWidth: '1152px',
        margin: '0 auto',
    };

    const headerStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize['2xl'],
        fontWeight: currentTheme.typography.fontWeight.bold,
        color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.xl,
    };

    const backButtonStyles: React.CSSProperties = {
        marginBottom: currentTheme.spacing.lg,
    };

    return (
        <div style={viewContainerStyles}>
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                leftIcon={<ChevronLeft size={20}/>}
                style={backButtonStyles}
            >
                Back to Screen Details
            </Button>

            <h1 style={headerStyles}>Edit Screen: {screen.name}</h1>

            <ScreenFormContainer
                initialData={screen}
                onSubmit={handleUpdateScreen}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};