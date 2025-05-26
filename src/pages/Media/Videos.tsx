import React, { useState } from 'react';
import { Search, MoreVertical, Plus } from 'lucide-react';

const mockVideos = [
    { id: 1, name: 'Krispy Kreme', type: 'Folder', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 2, name: 'Amazing Nature', type: 'Video', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
];

const Videos: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Video
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search in All Items"
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 bg-gray-200 rounded-lg">Tags</button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-gray-700">All Items</div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">+ Add folder</button>
                    <button className="px-4 py-2 bg-gray-200 rounded-lg">Actions</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            <input type="checkbox" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {mockVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <input type="checkbox" />
                            </td>
                            <td className="px-6 py-4">{video.name}</td>
                            <td className="px-6 py-4">{video.modified}</td>
                            <td className="px-6 py-4">{video.tags}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Videos;