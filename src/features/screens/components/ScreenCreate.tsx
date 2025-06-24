// src/features/screens/components/ScreenCreate.tsx
import React, {useState} from 'react';
import {ChevronLeft, Plus, X} from 'lucide-react';

// Mock ScreenForm component matching backend DTO structure
const ScreenForm = ({onSubmit, screenId}) => {
    const [formData, setFormData] = useState({
        screenCode: '',
        name: '',
        location: {
            name: '',
            latitude: '',
            longitude: ''
        },
        status: 'ONLINE',
        type: 'WINDOWS',
        screenSettingsDTO: {
            loop: false,
            cacheMedia: false,
            fallbackToCache: false
        }
    });

    const [metadata, setMetadata] = useState([]);
    const [settingsMetadata, setSettingsMetadata] = useState([]);

    const addMetadata = () => {
        setMetadata([...metadata, {label: '', value: ''}]);
    };

    const removeMetadata = (index) => {
        setMetadata(metadata.filter((_, i) => i !== index));
    };

    const updateMetadata = (index, field, value) => {
        setMetadata(metadata.map((item, i) =>
            i === index ? {...item, [field]: value} : item
        ));
    };

    const addSettingsMetadata = () => {
        setSettingsMetadata([...settingsMetadata, {label: '', value: ''}]);
    };

    const removeSettingsMetadata = (index) => {
        setSettingsMetadata(settingsMetadata.filter((_, i) => i !== index));
    };

    const updateSettingsMetadata = (index, field, value) => {
        setSettingsMetadata(settingsMetadata.map((item, i) =>
            i === index ? {...item, [field]: value} : item
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert metadata arrays to JSON objects
        const metadataObj = metadata.reduce((acc, item) => {
            if (item.label && item.value) {
                acc[item.label] = item.value;
            }
            return acc;
        }, {});

        const settingsMetadataObj = settingsMetadata.reduce((acc, item) => {
            if (item.label && item.value) {
                acc[item.label] = item.value;
            }
            return acc;
        }, {});

        const submitData = {
            ...formData,
            location: {
                ...formData.location,
                latitude: formData.location.latitude ? parseFloat(formData.location.latitude) : null,
                longitude: formData.location.longitude ? parseFloat(formData.location.longitude) : null
            },
            metadata: Object.keys(metadataObj).length > 0 ? metadataObj : null,
            screenSettingsDTO: {
                ...formData.screenSettingsDTO,
                settingsMetadata: Object.keys(settingsMetadataObj).length > 0 ? settingsMetadataObj : null
            }
        };

        onSubmit(submitData);
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({...prev, [field]: value}));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Screen Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Screen Code *
                </label>
                <input
                    type="text"
                    value={formData.screenCode}
                    onChange={(e) => handleInputChange('screenCode', e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
                <p className="mt-1 text-xs text-gray-500">Format: XXXX-XXXX-XXXX (uppercase letters and numbers)</p>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Screen Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Location Name
                    </label>
                    <input
                        type="text"
                        value={formData.location.name}
                        onChange={(e) => handleInputChange('location.name', e.target.value)}
                        placeholder="e.g., N1 Southbound - Midrand Exit"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Latitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={formData.location.latitude}
                        onChange={(e) => handleInputChange('location.latitude', e.target.value)}
                        placeholder="e.g., -25.9812"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Longitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        value={formData.location.longitude}
                        onChange={(e) => handleInputChange('location.longitude', e.target.value)}
                        placeholder="e.g., 28.1224"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="MAINTENANCE">Maintenance</option>
                </select>
            </div>

            {/* System Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    System Type
                </label>
                <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="WINDOWS">Windows</option>
                    <option value="MAC">Mac</option>
                    <option value="LINUX">Linux</option>
                    <option value="ANDROID">Android</option>
                    <option value="IOS">iOS</option>
                    <option value="WEB">Web</option>
                </select>
            </div>

            {/* Metadata */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Metadata
                    </label>
                    <button
                        type="button"
                        onClick={addMetadata}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <Plus className="w-4 h-4 mr-1"/>
                        Add Metadata
                    </button>
                </div>
                {metadata.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Label (e.g., orientation, sizeInInches, resolution)"
                            value={item.label}
                            onChange={(e) => updateMetadata(index, 'label', e.target.value)}
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Value (e.g., portrait, 65, 1080x1920)"
                            value={item.value}
                            onChange={(e) => updateMetadata(index, 'value', e.target.value)}
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => removeMetadata(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>

            {/* Screen Settings */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Settings</h3>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="loop"
                            checked={formData.screenSettingsDTO.loop}
                            onChange={(e) => handleInputChange('screenSettingsDTO.loop', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="loop" className="ml-2 block text-sm text-gray-900">
                            Enable Loop
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="cacheMedia"
                            checked={formData.screenSettingsDTO.cacheMedia}
                            onChange={(e) => handleInputChange('screenSettingsDTO.cacheMedia', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="cacheMedia" className="ml-2 block text-sm text-gray-900">
                            Cache Media
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="fallbackToCache"
                            checked={formData.screenSettingsDTO.fallbackToCache}
                            onChange={(e) => handleInputChange('screenSettingsDTO.fallbackToCache', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="fallbackToCache" className="ml-2 block text-sm text-gray-900">
                            Fallback to Cache
                        </label>
                    </div>
                </div>

                {/* Settings Metadata */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Settings Metadata
                        </label>
                        <button
                            type="button"
                            onClick={addSettingsMetadata}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-4 h-4 mr-1"/>
                            Add Settings Metadata
                        </button>
                    </div>
                    {settingsMetadata.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Label (e.g., brightness, volume, powerSaving)"
                                value={item.label}
                                onChange={(e) => updateSettingsMetadata(index, 'label', e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Value (e.g., 90, 0, true)"
                                value={item.value}
                                onChange={(e) => updateSettingsMetadata(index, 'value', e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeSettingsMetadata(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    {screenId ? 'Save Changes' : 'Add Screen'}
                </button>
            </div>
        </form>
    );
};

export const ScreenCreate = () => {
    const navigate = (path) => {
        console.log(`Navigating to: ${path}`);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('..')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ChevronLeft className="w-5 h-5 mr-1"/>
                Back to Screens
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Screen</h1>

            <ScreenForm
                onSubmit={async (data) => {
                    console.log('Form submitted:', data);
                    navigate('..');
                }}
            />
        </div>
    );
};

export default ScreenCreate;