// src/features/playlist/components/SetToScreenModal.tsx

import React, {useEffect, useState} from 'react';
import {Loader2, X} from 'lucide-react';
import {screensService} from '../../../services/screens.service';

// --- Type Definitions for Clarity ---

// Define a simple type for a screen object
interface Screen {
    id: number;
    name: string;
}

// Define the type for the playlist object this modal expects
interface Playlist {
    playlistData: { duration: number; loop: boolean; transition: string; };
    contentIds: never[];
    screenPlaylistQueues: never[];
    id: number;
    name: string;
}

// Define the shape of the data passed to the onSave callback
export interface SetToScreenSaveData {
    playlist: Playlist;
    type: 'default' | 'takeover';
    screenIds: number[];
}

interface SetToScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlist: Playlist | null;
    onSave: (data: SetToScreenSaveData) => void;
}

// --- Helper Components ---

// A simple, reusable tooltip
const Tooltip: React.FC<{ children: React.ReactNode; content: string }> = ({children, content}) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative inline-block">
            <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
                {children}
            </div>
            {isVisible && (
                <div
                    className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-3 py-2 text-xs text-white shadow-lg">
                    {content}
                    <div
                        className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

/**
 * A modal for setting a playlist to one or more screens.
 * Fetches screen data internally when opened.
 */
const SetToScreenModal: React.FC<SetToScreenModalProps> = ({isOpen, onClose, playlist, onSave}) => {
    // State for the list of screens and loading/error status
    const [allScreens, setAllScreens] = useState<Screen[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for user selections in the modal
    const [selectedType, setSelectedType] = useState<'default' | 'takeover'>('default');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScreens, setSelectedScreens] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Fetch the list of screens only when the modal is opened
    useEffect(() => {
        if (isOpen) {
            const fetchScreens = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Assuming screensService.getAllScreens() returns an array of Screen objects
                    const screensData = await screensService.getAllScreens();
                    setAllScreens(screensData);
                } catch (err) {
                    console.error("Failed to fetch screens:", err);
                    setError("Could not load screens. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchScreens();
        }
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedType('default');
            setSearchTerm('');
            setSelectedScreens([]);
            setSelectAll(false);
            setError(null);
        }
    }, [isOpen]);

    // Filter screens based on the search term
    const filteredScreens = allScreens.filter(screen =>
        screen.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle "Select All" functionality
    useEffect(() => {
        if (selectAll) {
            setSelectedScreens(filteredScreens.map(screen => screen.id));
        } else {
            // This prevents deselecting items that are not visible due to filtering
            if (selectedScreens.length === filteredScreens.length) {
                setSelectedScreens([]);
            }
        }
    }, [selectAll, filteredScreens]);

    // Update the "Select All" checkbox state based on individual selections
    useEffect(() => {
        if (filteredScreens.length > 0 && selectedScreens.length === filteredScreens.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedScreens, filteredScreens]);

    const handleScreenToggle = (screenId: number) => {
        setSelectedScreens(prev =>
            prev.includes(screenId) ? prev.filter(id => id !== screenId) : [...prev, screenId]
        );
    };

    const handleCancel = () => {
        // Reset state and close the modal
        setSelectedType('default');
        setSearchTerm('');
        setSelectedScreens([]);
        setSelectAll(false);
        setError(null);
        onClose();
    };

    const handleSave = () => {
        if (!playlist) return;

        onSave({
            playlist,
            type: selectedType,
            screenIds: selectedScreens,
        });

        // Don't reset state here - let the parent component handle navigation
        // The useEffect above will reset state when modal closes
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="flex h-full max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">Set to Screen</h2>
                    <button onClick={handleCancel}
                            className="text-gray-400 transition-colors hover:text-gray-600">
                        <X size={20}/>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {/* Type Selection */}
                    <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">Type</label>
                        <div className="flex gap-6">
                            {/* default content radio */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="default"
                                    checked={selectedType === 'default'}
                                    onChange={() => setSelectedType('default')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Set as Default Content</span>
                                <Tooltip content="Will replace screen default content">
                                    <span
                                        className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded cursor-help">i</span>
                                </Tooltip>
                            </label>
                            {/* takeover radio */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="takeover"
                                    checked={selectedType === 'takeover'}
                                    onChange={() => setSelectedType('takeover')}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Takeover</span>
                                <Tooltip content="Will override any content being played for specified duration">
                                    <span
                                        className="text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded cursor-help">i</span>
                                </Tooltip>
                            </label>
                        </div>
                    </div>

                    {/* Screen Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Select Screen(s)</label>
                        <input
                            type="text"
                            placeholder="Search for a screen"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-6 text-gray-500">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                    Loading screens...
                                </div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-600">{error}</div>
                            ) : (
                                <>
                                    <label
                                        className="flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 hover:bg-gray-50">
                                        <input type="checkbox" checked={selectAll}
                                               onChange={(e) => setSelectAll(e.target.checked)}
                                               className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                        <span className="text-sm font-medium text-gray-700">Select All</span>
                                    </label>
                                    {filteredScreens.length > 0 ? (
                                        filteredScreens.map((screen) => (
                                            <label key={screen.id}
                                                   className="flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-50">
                                                <input type="checkbox" checked={selectedScreens.includes(screen.id)}
                                                       onChange={() => handleScreenToggle(screen.id)}
                                                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                                <span className="text-sm text-gray-700">{screen.name}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-sm text-gray-500">No screens found</div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {selectedScreens.length > 0 && (
                        <div
                            className="text-sm text-gray-600">{selectedScreens.length} screen{selectedScreens.length !== 1 ? 's' : ''} selected</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 border-t border-gray-200 p-4">
                    <button onClick={handleCancel}
                            className="flex-1 rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={selectedScreens.length === 0 || !playlist}
                            className="flex-1 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300">
                        Save and Set to Screen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetToScreenModal;