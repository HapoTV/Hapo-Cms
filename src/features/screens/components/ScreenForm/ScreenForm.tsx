// src/features/screens/components/ScreenForm/ScreenForm.tsx

import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {LocationSearchInput} from './LocationSearchInput.tsx';
import {LocationMapEmbed} from '../LocationMapEmbed';
import {ScreenSettings} from '../ScreenSettings';
import {Button, Card, Input, MetadataEditor} from '../../../../components/ui';
import {useTheme} from '../../../../contexts/ThemeContext';


/**
 * The main UI component for the Screen creation/editing form, now fully themed.
 */
export const ScreenForm: React.FC<{
    onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEditMode: boolean;
    isSubmitting: boolean
}> = ({onFormSubmit, isEditMode, isSubmitting}) => {
    // 3. Get `register` and `errors` here to pass them down
    const {register, control, watch, formState: {errors}} = useFormContext();
    const {currentTheme} = useTheme();

    const location = watch('location');


    // Define style objects for cleaner JSX
    const sectionTitleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.lg,
        fontWeight: 500, color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.md
    };
    // Styles for custom form fields to match the <Input> component's label and error text
    const labelStyles: React.CSSProperties = {
        display: 'block',
        fontSize: currentTheme.typography.fontSize.sm,
        fontWeight: 500, color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.xs
    };
    const errorTextStyles: React.CSSProperties = {
        color: currentTheme.colors.status.error,
        fontSize: currentTheme.typography.fontSize.sm,
        marginTop: currentTheme.spacing.xs
    };

    return (
        <Card>
            <form onSubmit={onFormSubmit} style={{
                padding: currentTheme.spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: currentTheme.spacing.xl
            }}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: currentTheme.spacing.xl}}>
                    {/* Left Column */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.lg}}>
                        <div>
                            <h2 style={sectionTitleStyles}>Screen Details</h2>
                            <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
                                {!isEditMode && (
                                    <Input
                                        label="Screen Code"
                                        placeholder="XXXX-XXXX-XXXX"
                                        required
                                        {...register('screenCode')}
                                        error={errors.screenCode?.message as string}
                                    />
                                )}
                                <Input
                                    label="Screen Name"
                                    placeholder="Enter screen name"
                                    required
                                    {...register('name')}
                                    error={errors.name?.message as string}
                                />
                            </div>
                        </div>
                        <MetadataEditor name="metadata" title="Screen Metadata"/>
                    </div>

                    {/* Right Column */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.lg}}>
                        <div>
                            <h2 style={sectionTitleStyles}>Location</h2>
                            {/* 2. CORRECTED: Build the form field for the custom component manually */}
                            <Controller
                                name="location"
                                control={control}
                                render={({field, fieldState}) => (
                                    <div>
                                        <label style={labelStyles}>Search Location</label>
                                        <LocationSearchInput
                                            initialValue={field.value?.name || ''}
                                            onPlaceSelect={(loc) => field.onChange(loc)}
                                        />
                                        {fieldState.error?.message &&
                                            <p style={errorTextStyles}>{fieldState.error.message}</p>
                                        }
                                    </div>
                                )}
                            />

                            {location?.latitude && location?.longitude && (
                                <div style={{
                                    marginTop: currentTheme.spacing.md,
                                    borderRadius: currentTheme.borderRadius.md,
                                    overflow: 'hidden'
                                }}>
                                    <LocationMapEmbed
                                        latitude={location.latitude}
                                        longitude={location.longitude}
                                        locationName={location.name}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Settings Section */}
                <div style={{
                    borderTop: `1px solid ${currentTheme.colors.border.primary}`,
                    paddingTop: currentTheme.spacing.lg
                }}>
                    <ScreenSettings/>
                    <div style={{marginTop: currentTheme.spacing.lg}}>
                        <MetadataEditor
                            name="screenSettingsDTO.settingsMetadata"
                            title="Screen Settings Metadata"/>
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    borderTop: `1px solid ${currentTheme.colors.border.primary}`,
                    paddingTop: currentTheme.spacing.lg
                }}>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {isEditMode ? 'Save Changes' : 'Add Screen'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};