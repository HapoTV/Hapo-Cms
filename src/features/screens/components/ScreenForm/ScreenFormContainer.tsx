import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ScreenForm} from './ScreenForm';
import {screenFormSchema, transformToPayload} from './screenFormSchema';
import type {Screen, ScreenCreationPayload} from '../../../../types/models/screen.types';

// Helper to convert backend object to form's {label, value} array
const fromObject = (obj: Record<string, unknown> | undefined) =>
    obj ? Object.entries(obj).map(([label, value]) => ({label, value: String(value)})) : [];

interface ScreenFormContainerProps {
    initialData?: Screen | null;
    onSubmit: (payload: ScreenCreationPayload | Screen) => Promise<void>;
    isSubmitting: boolean;
}

export const ScreenFormContainer: React.FC<ScreenFormContainerProps> = ({
                                                                            initialData,
                                                                            onSubmit,
                                                                            isSubmitting
                                                                        }) => {
    const isEditMode = !!initialData;

    const methods = useForm({
        resolver: zodResolver(screenFormSchema),
        defaultValues: {
            // Conditionally include screenCode field only for creation form
            ...(isEditMode ? {} : {screenCode: ''}),
            name: initialData?.name || '',
            location: initialData?.location || {name: '', latitude: 0, longitude: 0},
            metadata: fromObject(initialData?.metadata),
            screenSettingsDTO: {
                loop: initialData?.screenSettingsDTO?.loop ?? true,
                cacheMedia: initialData?.screenSettingsDTO?.cacheMedia ?? true,
                fallbackToCache: initialData?.screenSettingsDTO?.fallbackToCache ?? true,
                settingsMetadata: fromObject(initialData?.screenSettingsDTO?.settingsMetadata),
            },
        },
    });

    const handleFormSubmit = async (formData: any) => {
        const payload = transformToPayload(formData);
        // Add the ID for updates
        if (isEditMode && initialData?.id) {
            (payload as unknown as Screen).id = initialData.id;
        }
        await onSubmit(payload);
    };

    return (
        <FormProvider {...methods}>
            <ScreenForm
                onFormSubmit={methods.handleSubmit(handleFormSubmit)}
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
            />
        </FormProvider>
    );
};
