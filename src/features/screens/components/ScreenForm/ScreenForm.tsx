// This component is now "dumb" and gets all its state and functions from the context.
import React from 'react';
import {Controller, useFieldArray, useFormContext} from 'react-hook-form';
import {Plus, X} from 'lucide-react';
import {LocationSearchInput} from '../LocationSearchInput';
import {LocationMapEmbed} from '../LocationMapEmbed';
import {ScreenSettings} from '../ScreenSettings';

interface ScreenFormProps {
    onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEditMode: boolean;
    isSubmitting: boolean;
}

/**
 * A reusable component for creating key-value metadata pairs.
 * Used for the main screen metadata.
 */
const MetadataEditor: React.FC<{ name: string; title: string }> = ({name, title}) => {
    const {control, register, formState: {errors}} = useFormContext();
    const {fields, append, remove} = useFieldArray({control, name});

    // Safely access nested errors
    const fieldErrors = name.split('.').reduce((acc, part) => acc?.[part], errors) as any;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                <button
                    type="button"
                    onClick={() => append({label: '', value: ''})}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                    <Plus className="w-4 h-4"/>
                    Add
                </button>
            </div>

            {fields.length === 0 && (
                <p className="text-sm text-gray-500 italic">No metadata entries yet</p>
            )}

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                            <input
                                {...register(`${name}.${index}.label`)}
                                placeholder="Label"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                            {fieldErrors?.[index]?.label && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors[index].label.message}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                {...register(`${name}.${index}.value`)}
                                placeholder="Value"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                            />
                            {fieldErrors?.[index]?.value && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors[index].value.message}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove entry"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * The main UI component for the Screen creation/editing form.
 * It is a "dumb" component that receives all state and logic from a FormProvider parent.
 */
export const ScreenForm: React.FC<ScreenFormProps> = ({onFormSubmit, isEditMode, isSubmitting}) => {
    const {register, control, watch, formState: {errors}} = useFormContext();

    // Watch the location field to update the map in real-time
    const location = watch('location');
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={onFormSubmit} className="p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Core Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Screen Details</h2>

                            {!isEditMode && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Screen Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('screenCode')}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="XXXX-XXXX-XXXX"
                                    />
                                    {errors.screenCode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.screenCode.message as string}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Screen Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter screen name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                                )}
                            </div>
                        </div>

                        <MetadataEditor name="metadata" title="Screen Metadata"/>
                    </div>

                    {/* Right Column: Location */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Location
                                </label>
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({field}) => (
                                        <LocationSearchInput
                                            initialValue={field.value?.name || ''}
                                            onPlaceSelect={(loc) => field.onChange(loc)}
                                        />
                                    )}
                                />
                                {errors.location?.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.name.message as string}</p>
                                )}
                            </div>

                            {location?.latitude && location?.longitude && (
                                <div className="mt-4">
                                    <LocationMapEmbed
                                        apiKey={googleMapsApiKey}
                                        latitude={location.latitude}
                                        longitude={location.longitude}
                                        locationName={location.name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Screen Settings Section */}
                <div className="border-t border-gray-200 pt-6">
                    <ScreenSettings/>
                    <div className="mt-6">
                        <MetadataEditor name="screenSettingsDTO.settingsMetadata" title="Screen Settings Metadata"/>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
                                Saving...
                            </>
                        ) : (
                            isEditMode ? 'Save Changes' : 'Add Screen'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
