// NEW FILE: src/features/screens/components/ScreenDetails.tsx

import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle, Clock, Globe, MapPin, Monitor, RotateCcw, Save, Settings, Wifi, X} from 'lucide-react';
import {useTheme} from '../../../contexts/ThemeContext';
import {Alert, Button, Card, Input, LoadingSpinner} from '../../../components/ui';

// Import the necessary types, assuming they are consolidated or accessible
import type {
    Screen,
    ScreenActivity,
    ScreenSettings as ScreenSettingsType,
    SettingsFormData
} from '../types/screen-details.types';
import {settingsFormSchema, SUPPORTED_REFRESH_RATES, SUPPORTED_RESOLUTIONS} from '../types/screen-details.types';


// Helper component for detail items, reused from ScreenDetailsView refactor
const DetailItem = ({icon, label, value}: {
    icon: React.ReactNode,
    label: string,
    value: string | React.ReactNode
}) => {
    const {currentTheme} = useTheme();
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBlock: currentTheme.spacing.sm,
            borderBottom: `1px solid ${currentTheme.colors.border.primary}`
        }}>
            <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.sm}}>
                {icon}
                <span style={{
                    fontSize: currentTheme.typography.fontSize.sm,
                    color: currentTheme.colors.text.secondary
                }}>{label}</span>
            </div>
            <span style={{
                fontSize: currentTheme.typography.fontSize.sm,
                fontWeight: 500,
                color: currentTheme.colors.text.primary
            }}>{value}</span>
        </div>
    );
};

// Props for the new combined component
interface ScreenDetailsProps {
    screen: Screen;
    activity: ScreenActivity | null;
    activityError: string | null;
    settings: ScreenSettingsType | null;
    settingsLoading: boolean;
    settingsError: string | null;
    onSaveSettings: (data: SettingsFormData) => Promise<void>;
    onResetSettings: () => Promise<void>;
    isSavingSettings: boolean;
    saveStatus: 'idle' | 'success' | 'error';
}

export const ScreenDetails: React.FC<ScreenDetailsProps> = ({
                                                                screen,
                                                                activity,
                                                                activityError,
                                                                settings,
                                                                settingsLoading,
                                                                settingsError,
                                                                onSaveSettings,
                                                                onResetSettings,
                                                                isSavingSettings,
                                                                saveStatus
                                                            }) => {
    const {currentTheme} = useTheme();
    const {register, handleSubmit, reset, watch, formState: {isDirty}} = useForm<SettingsFormData>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: settings || undefined,
    });

    const brightness = watch('settingsMetadata.brightness', settings?.settingsMetadata.brightness);
    const volume = watch('settingsMetadata.volume', settings?.settingsMetadata.volume);

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const isConnected = activity?.connected;
    const lastHeartbeat = activity ? new Date(activity.lastHeartbeat) : null;
    const minutesAgo = lastHeartbeat ? Math.floor((Date.now() - lastHeartbeat.getTime()) / 60000) : 0;

    const sectionTitleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.lg,
        fontWeight: 500,
        color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: currentTheme.spacing.sm,
    };

    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: currentTheme.spacing.xl}}>
            {/* Left Column: Screen Info & Connection Status */}
            <Card elevated padding="lg"
                  style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.lg}}>
                {/* Screen Info */}
                <div>
                    <h3 style={sectionTitleStyles}><Monitor size={20}
                                                            style={{color: currentTheme.colors.brand.primary}}/> Screen
                        Info</h3>
                    <DetailItem
                        icon={<MapPin size={16}/>}
                        label="Location"
                        value={screen.location?.name || 'N/A'}
                    />
                    <DetailItem
                        icon={<Settings size={16}/>}
                        label="Resolution"
                        value={screen.metadata?.resolution || 'Default'}
                    />
                    <DetailItem
                        icon={<Monitor size={16}/>}
                        label="Type"
                        value={screen.type}
                    />
                </div>

                {/* Connection Status */}
                <div>
                    <h3 style={sectionTitleStyles}>
                        <Wifi size={20} style={{color: currentTheme.colors.brand.primary}}/> Connection</h3>
                    {activityError ? (
                        <Alert variant="warning" title="Connection Warning">{activityError}</Alert>
                    ) : !activity ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBlock: currentTheme.spacing.lg,
                            gap: currentTheme.spacing.sm,
                            color: currentTheme.colors.text.tertiary
                        }}>
                            <LoadingSpinner size="sm"/>
                            <span>Loading status...</span>
                        </div>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
                            <Alert variant={isConnected ? 'success' : 'error'} showIcon>
                                {isConnected ? 'Screen is online and responsive' : 'Screen is not responding'}
                            </Alert>
                            <DetailItem
                                icon={<Clock size={16}/>}
                                label="Last Heartbeat"
                                value={lastHeartbeat ? `${lastHeartbeat.toLocaleTimeString()} (${minutesAgo} min ago)` : 'N/A'}
                            />
                            <DetailItem
                                icon={<Globe size={16}/>}
                                label="IP Address"
                                value={activity.connectionIp}
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* Right Column: Settings Form */}
            <Card elevated padding="lg">
                <h2 style={sectionTitleStyles}>Display Settings</h2>
                {settingsLoading ? (
                    <div style={{display: 'grid', placeContent: 'center', height: '100%'}}>
                        <LoadingSpinner size="xl"/>
                    </div>
                ) : settingsError ? (
                    <Alert variant="error" title="Error Loading Settings">{settingsError}</Alert>
                ) : settings ? (
                    <form onSubmit={handleSubmit(onSaveSettings)}
                          style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.lg}}>
                        {/* Checkboxes */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: currentTheme.spacing.md
                        }}>
                            <Input {...register('loop')} as="checkbox" label="Loop Content"
                                   helperText="Continuously repeat playlist"/>
                            <Input {...register('cacheMedia')} as="checkbox" label="Cache Media"
                                   helperText="Store media locally"/>
                            <Input {...register('fallbackToCache')} as="checkbox" label="Fallback to Cache"
                                   helperText="Use cache when offline"/>
                            <Input {...register('settingsMetadata.autoPlay')} as="checkbox" label="Auto-play"
                                   helperText="Start content automatically"/>
                        </div>

                        {/* Sliders */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: currentTheme.spacing.md
                        }}>
                            <Input {...register('settingsMetadata.brightness')} as="range"
                                   label={`Brightness: ${brightness}%`}/>
                            <Input {...register('settingsMetadata.volume')} as="range" label={`Volume: ${volume}%`}/>
                        </div>

                        {/* Selects and Inputs */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: currentTheme.spacing.md
                        }}>
                            <Input {...register('settingsMetadata.resolution')} as="select" label="Resolution">
                                {SUPPORTED_RESOLUTIONS.map(res => <option key={res.value}
                                                                          value={res.value}>{res.label}</option>)}
                            </Input>
                            <Input {...register('settingsMetadata.refreshRate')} as="select" label="Refresh Rate">
                                {SUPPORTED_REFRESH_RATES.map(rate => <option key={rate.value}
                                                                             value={rate.value}>{rate.label}</option>)}
                            </Input>
                            <Input {...register('settingsMetadata.transitionDuration')} type="number"
                                   label="Transition (sec)"/>
                        </div>

                        {/* Sticky Footer for Actions */}
                        <div style={{
                            borderTop: `1px solid ${currentTheme.colors.border.primary}`,
                            paddingTop: currentTheme.spacing.md,
                            marginTop: 'auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Button type="button" variant="secondary" onClick={onResetSettings}
                                    disabled={isSavingSettings} leftIcon={<RotateCcw size={16}/>}>
                                Reset
                            </Button>
                            <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.md}}>
                                {saveStatus === 'success' && <span style={{
                                    color: currentTheme.colors.status.success,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: currentTheme.spacing.xs
                                }}><CheckCircle size={16}/> Saved</span>}
                                {saveStatus === 'error' && <span style={{
                                    color: currentTheme.colors.status.error,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: currentTheme.spacing.xs
                                }}><X size={16}/> Error</span>}
                                <Button type="submit" variant="primary" loading={isSavingSettings}
                                        disabled={!isDirty || isSavingSettings} leftIcon={<Save size={16}/>}>
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <p>No settings available.</p>
                )}
            </Card>
        </div>
    );
};