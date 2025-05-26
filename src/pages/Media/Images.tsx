import React, { useState } from 'react';
import { Search, MoreVertical, Plus, Edit, Trash2, Copy, Move, FileText, ListPlus, Monitor } from 'lucide-react';

const mockImages = [
    { id: 1, name: 'Krispy Kreme', type: 'Folder', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 2, name: 'Green Waterfall', type: 'Image', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 3, name: 'Flowers', type: 'Image', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 4, name: 'Closed Sign', type: 'Image', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 5, name: 'Blue Waterfall', type: 'Image', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
    { id: 6, name: 'Beach Tree', type: 'Image', modified: 'May 28, 2024 - 08:44 AM', tags: '' },
];

const Images: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Images</h1>
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Image
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
                    {mockImages.map((image) => (
                        <tr key={image.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <input type="checkbox" />
                            </td>
                            <td className="px-6 py-4">{image.name}</td>
                            <td className="px-6 py-4">{image.modified}</td>
                            <td className="px-6 py-4">{image.tags}</td>
                            <td className="px-6 py-4 text-right relative">
                                <button
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                    onClick={() => setDropdownOpen(dropdownOpen === image.id ? null : image.id)}
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                                {dropdownOpen === image.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                                        <ul className="py-1 text-gray-700">
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><Edit className="w-4 h-4 mr-2" /> Edit</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><ListPlus className="w-4 h-4 mr-2" /> Add to Playlist</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><Monitor className="w-4 h-4 mr-2" /> Set to Screen</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><Copy className="w-4 h-4 mr-2" /> Duplicate</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><Move className="w-4 h-4 mr-2" /> Move</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"><FileText className="w-4 h-4 mr-2" /> Item Details</li>
                                            <li className="px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center cursor-pointer"><Trash2 className="w-4 h-4 mr-2" /> Delete</li>
                                        </ul>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Images;
