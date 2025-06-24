import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {AlertCircle, ChevronLeft, Edit, Loader2, MapPin, Monitor, Settings} from 'lucide-react';
import {ScreenStatusBadge} from './ScreenStatusBadge';
import {screensService} from '../../../services/screens.service';
import type {Screen, ScreenConnectionStatus} from '../../../types/models/screen.types';

export const ScreenDetails = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const [screen, setScreen] = useState<Screen | null>(null);
    const [activity, setActivity] = useState<ScreenConnectionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [screenError, setScreenError] = useState<string | null>(null);
    const [activityError, setActivityError] = useState<string | null>(null);

    // This is the required variable for the Google Maps API key.
    // It must be defined in your .env.local file as VITE_GOOGLE_MAPS_API_KEY=...
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (!id) {
            setScreenError("No screen ID provided in URL.");
            setLoading(false);
            return;
        }

        const screenId = Number(id);

        const fetchAllDetails = async () => {
            setLoading(true);
            setScreenError(null);
            setActivityError(null);

            // Fetch screen details and activity in parallel for efficiency
            const [screenResult, activityResult] = await Promise.allSettled([
                screensService.getScreenById(screenId),
                screensService.getScreenActivity(screenId)
            ]);

            // Handle the result for the main screen data
            if (screenResult.status === 'fulfilled') {
                setScreen(screenResult.value);
            } else {
                console.error("Error fetching screen details:", screenResult.reason);
                setScreenError("Could not load the screen's main details.");
            }

            // Handle the result for the activity data
            if (activityResult.status === 'fulfilled') {
                setActivity(activityResult.value);
            } else {
                // This is where we handle the "No active connection" message
                console.error("Error fetching screen activity:", activityResult.reason);
                const errorData = (activityResult.reason as any)?.response?.data;
                // If the API returns a 404, use its specific message. Otherwise, use a generic one.
                if (errorData?.status === 404) {
                    setActivityError(errorData.message);
                } else {
                    setActivityError("Could not load connection status.");
                }
            }

            setLoading(false);
        };

        fetchAllDetails();
    }, [id]);

    const renderConnectionStatus = () => {
        if (activityError) {
            return (
                <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600"/>
                    <p className="text-sm text-yellow-800">{activityError}</p>
                </div>
            );
        }

        if (!activity) {
            // This can happen briefly before data loads or if the call fails unexpectedly
            return <p className="text-gray-500">Loading activity...</p>;
        }

        return (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between"><span className="text-gray-600">Connected</span><span
                    className={`font-medium ${activity.connected ? 'text-green-600' : 'text-red-600'}`}>{activity.connected ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between"><span className="text-gray-600">Last Heartbeat</span><span
                    className="text-gray-900">{new Date(activity.lastHeartbeat).toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span
                    className="text-gray-600">Client Info</span><span
                    className="text-gray-900 truncate">{activity.clientInfo}</span></div>
                <div className="flex items-center justify-between"><span
                    className="text-gray-600">IP Address</span><span
                    className="text-gray-900">{activity.connectionIp}</span></div>
            </div>
        );
    };

    // Helper function to render the location map
    const renderLocationMap = () => {
        const hasLocation = screen?.location?.latitude && screen.location.longitude;
        if (!hasLocation) {
            return <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">Location not specified.</div>;
        }
        if (!googleMapsApiKey) {
            return <div className="bg-red-50 p-4 rounded-lg text-center text-red-700"><p
                className="font-semibold">Google Maps API Key missing.</p><p className="text-sm">Set
                VITE_GOOGLE_MAPS_API_KEY in .env.local</p></div>;
        }
        return (
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-4">{screen.location.name}</p>
                <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <iframe width="100%" height="100%" style={{border: 0}} loading="lazy" allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${screen.location.latitude},${screen.location.longitude}&zoom=15`}
                            title="Screen Location"/>
                </div>
                <p className="text-sm text-gray-500 mt-2">Coordinates: {screen.location.latitude}, {screen.location.longitude}</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500"/>
            </div>
        );
    }

    // Top-level loading and error states for the main screen data
    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2
        className="w-12 h-12 animate-spin text-blue-500"/></div>;
    if (screenError || !screen) return <div
        className="text-center p-8 text-red-600">{screenError || 'Screen data is unavailable.'}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ChevronLeft className="w-5 h-5 mr-1"/>
                Back
            </button>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Monitor className="w-8 h-8 text-gray-400"/>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{screen.name}</h1>
                                <p className="text-gray-500">{screen.type} Screen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ScreenStatusBadge status={screen.status} size="lg"/>
                            <Link to={`/screens/${id}/edit`}
                                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                <Edit className="w-4 h-4 mr-2"/>
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2"><MapPin
                                    className="w-5 h-5 text-gray-400"/><span
                                    className="text-gray-600">{screen.location?.name || 'N/A'}</span></div>
                                <div className="flex items-center gap-2"><Settings
                                    className="w-5 h-5 text-gray-400"/><span
                                    className="text-gray-600">{screen.metadata?.resolution || 'N/A'}</span></div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Current Content</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">{screen.currentPlaylist?.name || "No active playlist"}</p>
                                <p className="text-sm text-gray-500 mt-2">Queue: {screen.playlistQueue.length} items</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                            {renderLocationMap()}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Connection Status</h2>
                            {renderConnectionStatus()}
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <Settings className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="text-gray-900">Loop
                                            Content: {screen.screenSettingsDTO?.loop ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Settings className="w-5 h-5 text-gray-400 mt-1"/>
                                    <div>
                                        <p className="text-gray-900">Cache
                                            Media: {screen.screenSettingsDTO?.cacheMedia ? 'Enabled' : 'Disabled'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};