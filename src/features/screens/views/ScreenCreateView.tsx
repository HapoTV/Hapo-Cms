import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
import {ScreenFormContainer} from '../components/ScreenForm/ScreenFormContainer';
import {screensService} from '../../../services/screens.service';

export const ScreenCreateView = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This is the only logic this view needs: what to do with the final data.
    const handleCreateScreen = async (payload: import('../../../types/models/screen.types').ScreenCreationDTO) => {
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

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ChevronLeft size={20} className="mr-1"/> Back to Screens
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Screen</h1>

            {/* Render the container, passing the create-specific logic */}
            <ScreenFormContainer
                onSubmit={handleCreateScreen}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};
