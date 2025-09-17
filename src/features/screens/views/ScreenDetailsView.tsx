// src/features/screens/views/ScreenDetailsView.tsx

import React, {useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    CheckCircle,
    ChevronLeft,
    Clock,
    Edit,
    Globe,
    MapPin,
    Monitor,
    RotateCcw,
    Save,
    Settings,
    Wifi,
    X
} from 'lucide-react';

import {LocationSection} from '../components/screensDetails/LocationSection.tsx';
import {ErrorBoundary} from '../../../components/ErrorBoundary';
import {useScreenDetails} from '../hooks/useScreenDetails';
import {useScreenSettings} from '../hooks/useScreenSettings';

// Types
import type {ScreenStatus, SettingsFormData} from '../types';
import {settingsFormSchema, SUPPORTED_REFRESH_RATES, SUPPORTED_RESOLUTIONS} from '../types/screen-details.types';

// Themed UI Components
import {useTheme} from '../../../contexts/ThemeContext';
import {Alert, Button, Card, Input, LoadingSpinner, StatusBadge, StatusType} from '../../../components/ui';

const screenStatusMap: Record<ScreenStatus, StatusType> = {
    'ONLINE': 'online',
    'OFFLINE': 'offline',
    'MAINTENANCE': 'maintenance',
    'PENDING': 'pending',
    'UNREGISTERED': 'unregistered',
};

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

export const ScreenDetailsView = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {currentTheme} = useTheme();
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const {screen, activity, loading, screenError, activityError} = useScreenDetails(id);
    const {
        settings,
        isLoading: settingsLoading,
        error: settingsError,
        isSaving,
        saveStatus,
        updateSettings,
        resetSettings
    } = useScreenSettings(id || '');

    const {register, handleSubmit, reset, watch, formState: {errors, isDirty}} = useForm<SettingsFormData>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: settings || undefined,
    });

    const brightness = watch('settingsMetadata.brightness');
    const volume = watch('settingsMetadata.volume');

    useEffect(() => {
        if (settings) reset(settings);
    }, [settings, reset]);

    const handleSettingsSave = async (data: SettingsFormData) => await updateSettings(data);
    const handleSettingsReset = async () => {
        if (window.confirm('Are you sure you want to reset all settings to default values?')) {
            await resetSettings();
        }
    };

    // --- Start of Robust Render State Checks ---
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: currentTheme.colors.background.secondary
            }}>
                <LoadingSpinner size="xl"/>
            </div>
        );
    }

    if (screenError) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: currentTheme.spacing.lg,
                backgroundColor: currentTheme.colors.background.secondary
            }}>
                <Alert variant="error" title="Error Loading Screen">{screenError}</Alert>
            </div>
        );
    }

    if (!screen) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: currentTheme.spacing.lg,
                backgroundColor: currentTheme.colors.background.secondary
            }}>
                <Alert variant="warning" title="Screen Not Found">
                    The screen you are looking for could not be found.
                </Alert>
            </div>
        );
    }
    // --- End of Robust Render State Checks ---

    const isConnected = activity?.connected;
    const lastHeartbeat = activity ? new Date(activity.lastHeartbeat) : null;
    const minutesAgo = lastHeartbeat ? Math.floor((Date.now() - lastHeartbeat.getTime()) / 60000) : 0;

    const pageStyles: React.CSSProperties = {
        minHeight: '100vh',
        backgroundColor: currentTheme.colors.background.secondary
    };
    const headerStyles: React.CSSProperties = {
        backgroundColor: currentTheme.colors.background.primary,
        borderBottom: `1px solid ${currentTheme.colors.border.primary}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
    };
    const headerContentStyles: React.CSSProperties = {
        maxWidth: '1280px',
        margin: 'auto',
        padding: `${currentTheme.spacing.md} ${currentTheme.spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };
    const mainContentStyles: React.CSSProperties = {
        maxWidth: '1280px',
        margin: 'auto',
        padding: `${currentTheme.spacing.lg}`
    };
    const sectionTitleStyles: React.CSSProperties = {
        fontSize: currentTheme.typography.fontSize.lg,
        fontWeight: 500,
        color: currentTheme.colors.text.primary,
        marginBottom: currentTheme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: currentTheme.spacing.sm
    };

    return (
        <ErrorBoundary>
            <div style={pageStyles}>
                {/* Header */}
                <div style={headerStyles}>
                    <div style={headerContentStyles}>
                        <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.md}}>
                            <Button variant="ghost" onClick={() => navigate(-1)}
                                    leftIcon={<ChevronLeft size={20}/>}>Back</Button>
                            <div style={{
                                height: '24px',
                                width: '1px',
                                backgroundColor: currentTheme.colors.border.primary
                            }}/>
                            <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.md}}>
                                <Monitor size={32} style={{color: currentTheme.colors.text.tertiary}}/>
                                <div>
                                    <h1 style={{
                                        fontSize: currentTheme.typography.fontSize['2xl'],
                                        fontWeight: currentTheme.typography.fontWeight.bold,
                                        color: currentTheme.colors.text.primary
                                    }}>{screen.name}</h1>
                                    <p style={{
                                        fontSize: currentTheme.typography.fontSize.sm,
                                        color: currentTheme.colors.text.secondary
                                    }}>{screen.type} Screen</p>
                                </div>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: currentTheme.spacing.md}}>
                            <StatusBadge status={screenStatusMap[screen.status] ?? 'info'} size="lg"/>
                            <Link to={`/screens/${id}/edit`}>
                                <Button variant="primary" leftIcon={<Edit size={16}/>}>Edit Screen</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={mainContentStyles}>
                    <Card elevated padding="xl">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: currentTheme.spacing.xl,
                            marginBottom: currentTheme.spacing.xl
                        }}>
                            {/* Left Side: Merged Info */}
                            <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.lg}}>
                                <div>
                                    <h2 style={sectionTitleStyles}><Monitor size={20}/> Screen Details</h2>
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
                                    <DetailItem
                                        icon={<Wifi size={16}/>}
                                        label="Wifi"
                                        value={screen.status === 'ONLINE' ? 'Connected' : 'Disconnected'}
                                    />
                                </div>
                                <div>
                                    <h2 style={sectionTitleStyles}>Connection Status</h2>
                                    {activityError ? <Alert variant="warning">{activityError}</Alert> : !activity ?
                                        <p>Loading...</p> : (
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: currentTheme.spacing.md
                                            }}>
                                                <Alert variant={isConnected ? 'success' : 'error'} showIcon>
                                                    {isConnected ? 'Connected' : 'Disconnected'}
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
                            </div>

                            {/* Right Side: Location */}
                            <div>
                                <h2 style={sectionTitleStyles}>Location</h2>
                                <LocationSection
                                    screen={screen}
                                    googleMapsApiKey={googleMapsApiKey}
                                />
                            </div>
                        </div>
                        {/* Settings Section */}
                        <div>
                            <h2 style={sectionTitleStyles}>Display Settings</h2>
                            {settingsLoading ?
                                <div style={{display: 'grid', placeContent: 'center', height: '10rem'}}><LoadingSpinner
                                    size="lg"/></div> : settingsError ?
                                    <Alert variant="error">{settingsError}</Alert> : settings ? (
                                        <form onSubmit={handleSubmit(handleSettingsSave)} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: currentTheme.spacing.lg
                                        }}>
                                            {/* Form fields */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, 1fr)',
                                                gap: currentTheme.spacing.md
                                            }}>
                                                <Input {...register('loop')} as="checkbox" label="Loop Content"/>
                                                <Input {...register('cacheMedia')} as="checkbox" label="Cache Media"/>
                                                <Input {...register('fallbackToCache')} as="checkbox"
                                                       label="Fallback to Cache"/>
                                                <Input {...register('settingsMetadata.autoPlay')} as="checkbox"
                                                       label="Auto-play"/>
                                    </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: currentTheme.spacing.md
                                            }}>
                                                <Input {...register('settingsMetadata.brightness')} type="range"
                                                       label={`Brightness: ${brightness}%`}/>
                                                <Input {...register('settingsMetadata.volume')} type="range"
                                                       label={`Volume: ${volume}%`}/>
                                    </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: currentTheme.spacing.md
                                            }}>
                                                <Input {...register('settingsMetadata.resolution')} as="select"
                                                       label="Resolution">
                                                    {SUPPORTED_RESOLUTIONS.map(res =>
                                                        <option key={res.value} value={res.value}>
                                                            {res.label}
                                                        </option>)}
                                                </Input>
                                                <Input {...register('settingsMetadata.refreshRate')} as="select"
                                                       label="Refresh Rate">
                                                    {SUPPORTED_REFRESH_RATES.map(rate =>
                                                        <option key={rate.value} value={rate.value}>
                                                            {rate.label}
                                                        </option>)}
                                                </Input>
                                                <Input {...register('settingsMetadata.transitionDuration')}
                                                       type="number" label="Transition (sec)"
                                                       error={errors.settingsMetadata?.transitionDuration?.message}/>
                                    </div>
                                            <div style={{
                                                borderTop: `1px solid ${currentTheme.colors.border.primary}`,
                                                paddingTop: currentTheme.spacing.md,
                                                marginTop: 'auto',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={handleSettingsReset}
                                                    disabled={isSaving}
                                                    leftIcon={<RotateCcw size={16}/>}>
                                                    Reset to Defaults
                                                </Button>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: currentTheme.spacing.md
                                                }}>
                                                    {saveStatus === 'success' &&
                                                        <span style={{
                                                            color: currentTheme.colors.status.success, display: 'flex',
                                                            alignItems: 'center', gap: currentTheme.spacing.xs
                                                        }}>
                                                    <CheckCircle size={16}/>
                                                    Saved
                                                </span>}
                                                    {saveStatus === 'error' &&
                                                        <span style={{
                                                            color: currentTheme.colors.status.error, display: 'flex',
                                                            alignItems: 'center', gap: currentTheme.spacing.xs
                                                        }}>
                                                    <X size={16}/>
                                                    Error
                                                </span>}
                                                    <Button
                                                        type="submit"
                                                        variant="primary"
                                                        loading={isSaving} disabled={!isDirty || isSaving}
                                                        leftIcon={<Save size={16}/>}>
                                                        Save Settings
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : <p>No settings available.</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </ErrorBoundary>
    );
};