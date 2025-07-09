import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
import {ScreenFormContainer} from '../components/ScreenForm/ScreenFormContainer';
import {screensService} from '../../../services/screens.service';
import {useScreen} from '../hooks/useScreen'; // <-- We use our new hook here!

export const ScreenEditView = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const numericScreenId = id ? Number(id) : undefined;

    // 1. Fetch the data using the hook
    const {screen, isLoading, error} = useScreen(numericScreenId);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // The update-specific submission logic
    const handleUpdateScreen = async (payload) => {
        setIsSubmitting(true);
        try {
            await screensService.updateScreen(numericScreenId, payload); // Assuming update takes id and payload
            navigate(`/screens/${id}`);
        } catch (error) {
            console.error("Failed to update screen:", error);
            alert('Failed to update screen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading screen data...</div>;
    }

    // 3. Handle error state
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    // Handle case where screen is not found after loading
    if (!screen) {
        return <div className="p-8">Screen not found.</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ChevronLeft size={20} className="mr-1"/> Back to Screen Details
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Screen: {screen?.name}</h1>

            {/* 4. Pass the fetched data to the form container */}
            <ScreenFormContainer
                initialData={screen}
                onSubmit={handleUpdateScreen}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};