import React, { useState } from 'react';
import { X, Search, Monitor, PlaySquare } from 'lucide-react';
import { screensService } from '../../../services/screens.service';
import type { Schedule } from '../types';
import type { Screen } from '../../../services/screens.service';

interface ScheduleDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (schedule: Partial<Schedule>) => void;
    initialData?: Partial<Schedule>;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
                                                                              isOpen,
                                                                              onClose,
                                                                              onSave,
                                                                              initialData
                                                                          }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [screenSearch, setScreenSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Screen[]>([]);
    const [selectedScreens, setSelectedScreens] = useState<number[]>(initialData?.screenIds || []);

    const handleScreenSearch = async (query: string) => {
        setScreenSearch(query);
        if (query.trim()) {
            try {
                const screen = await screensService.getScreenByName(query);
                setSearchResults(screen ? [screen] : []);
            } catch (error) {
                console.error('Failed to search screens:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectScreen = (screenId: number) => {
        setSelectedScreens(prev =>
            prev.includes(screenId)
                ? prev.filter(id => id !== screenId)
                : [...prev, screenId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...initialData,
            name,
            description,
            screenIds: selectedScreens
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Schedule Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Search Screens</label>
                        <div className="mt-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={screenSearch}
                                onChange={(e) => handleScreenSearch(e.target.value)}
                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Search screens by name..."
                            />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-2 border rounded-lg divide-y">
                                {searchResults.map(screen => (
                                    <div
                                        key={screen.id}
                                        className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleSelectScreen(screen.id as number)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-900">{screen.name}</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selectedScreens.includes(screen.id as number)}
                                            onChange={() => handleSelectScreen(screen.id as number)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};