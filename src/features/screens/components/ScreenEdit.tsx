// src/features/screens/components/ScreenEdit.tsx
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft, Loader2} from 'lucide-react';
import {ScreenForm} from './ScreenForm';
import {screensService} from '../../../services/screens.service';
import type {Screen} from '../../../types/models/screen.types';

export const ScreenEdit = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const [initialData, setInitialData] = useState<Screen | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('No screen ID provided.');
            setLoading(false);
            return;
        }
        const fetchScreenData = async () => {
            try {
                setLoading(true);
                const data = await screensService.getScreenById(Number(id));
                setInitialData(data);
            } catch (err) {
                setError('Failed to load screen data for editing.');
                console.error('Error fetching screen data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchScreenData();
    }, [id]);

    const handleSubmit = async (formData: Partial<Screen>) => {
        if (!id) return;
        try {
            // Your updateScreen service method will send the partial data
            await screensService.updateScreen(Number(id), formData);
            // On success, navigate back to the details page to see the changes
            navigate(`/screens/${id}`);
        } catch (err) {
            console.error('Failed to update screen:', err);
            // You can show an error toast here (e.g., using react-hot-toast)
            alert('Failed to save changes. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2
        className="w-12 h-12 animate-spin text-blue-500"/></div>;
    if (error || !initialData) return <div
        className="text-center p-8 text-red-600">{error || 'Could not load screen for editing.'}</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={handleCancel} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ChevronLeft className="w-5 h-5 mr-1"/>
                Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Screen</h1>
            <ScreenForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </div>
    );
};