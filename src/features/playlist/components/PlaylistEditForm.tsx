import React, {useState} from 'react';
import {ChevronLeft, MoreHorizontal, Upload} from 'lucide-react';

const mockUuid = () => Math.random().toString(36).substr(2, 9);

const usePlaylistStore = () => {
    const [items, setItems] = useState([
        {
            id: 'item-1',
            imageUrl: 'https://via.placeholder.com/120x160/22c55e/ffffff?text=SOUP',
            duration: 5,
        },
        {
            id: 'item-2',
            imageUrl: 'https://via.placeholder.com/120x160/ef4444/ffffff?text=RED',
            duration: 5,
        },
        {
            id: 'item-3',
            imageUrl: 'https://via.placeholder.com/120x160/22c55e/ffffff?text=GREEN',
            duration: 12,
        }
    ]);

    const addItem = (newItem) => {
        if (items.length < 10) {
            setItems([...items, newItem]);
        }
    };

    const updateDuration = (itemId, change) => {
        setItems(items.map(item =>
            item.id === itemId
                ? {...item, duration: Math.max(1, item.duration + change)}
                : item
        ));
    };

    const totalDuration = () => {
        return items.reduce((total, item) => total + item.duration, 0);
    };

    return {items, addItem, updateDuration, totalDuration};
};

const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

export default function PlaylistDetailsLayout() {
    const {items, addItem, updateDuration, totalDuration} = usePlaylistStore();

    const handleUpload = () => {
        const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const itemNumber = items.length + 1;

        const fakeImage = {
            id: mockUuid(),
            imageUrl: `https://via.placeholder.com/120x160/${randomColor}/ffffff?text=NEW+${itemNumber}`,
            duration: 5,
        };
        addItem(fakeImage);
    };

    const padSlots = [...items, ...Array(10 - items.length).fill(null)];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-600 hover:text-gray-800">
                            <ChevronLeft className="w-4 h-4 mr-1"/>
                            All Playlists
                        </button>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium">
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium">
                            Preview
                        </button>
                        <div className="flex">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-l-md hover:bg-blue-700 font-medium">
                                Save
                            </button>
                            <button
                                className="px-2 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border-l border-blue-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Playlist Details</h1>

                {/* Playlist Preview Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-sm">
                    <div className="bg-gray-200 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-600 mb-2">MS - STORES 04-11-2024</div>
                        <div className="text-xs text-gray-500">Morsel Sausage</div>
                        <div className="text-xs text-gray-500">Weds 19:00-21:00</div>
                        <div className="text-xs text-gray-500">Every Week(s)</div>
                    </div>
                </div>

                {/* Playlist Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">Playlist</h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleUpload}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Upload className="w-4 h-4 mr-1"/>
                                Upload Media
                            </button>
                            <span className="text-sm text-gray-600">
                Total duration <strong>{formatTime(totalDuration())}</strong>
              </span>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-10 gap-4">
                        {padSlots.map((item, i) => (
                            <div
                                key={item?.id ?? `empty-${i}`}
                                className="aspect-[3/4] border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                            >
                                {item ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex-1 bg-gray-100">
                                            <img
                                                src={item.imageUrl}
                                                alt="media item"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-2 bg-white border-t border-gray-200">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => updateDuration(item.id, -1)}
                                                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-medium min-w-[20px] text-center">
                          {item.duration}"
                        </span>
                                                <button
                                                    onClick={() => updateDuration(item.id, 1)}
                                                    className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-xs flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                        <div className="text-center">
                                            <div
                                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Upload className="w-4 h-4"/>
                                            </div>
                                            <div className="text-xs">Empty</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Library Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Library</h3>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center text-gray-500 py-8">
                            Library content would go here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}