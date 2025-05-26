import React, { useState } from 'react';
import { Search, MoreVertical, Plus, Edit, Copy, ArrowUpRight, AlertCircle, Trash2 } from 'lucide-react';

const mockSchedules = [
    { id: 1, name: 'Krispy Kreme Box Stores Promo', modified: 'Jan 30, 2025 - 09:31 AM' },
    { id: 2, name: 'Simple Layout 9am to 5pm, Closed Sign 5pm to 10pm', modified: 'May 28, 2024 - 08:44 AM' },
    { id: 3, name: 'Simple Layout 9am to 9pm, Turn Off TV screen 9pm to 9am', modified: 'May 28, 2024 - 08:44 AM' },
    { id: 4, name: 'Empty Schedule (Plays Default Content)', modified: 'May 28, 2024 - 08:44 AM' },
    { id: 5, name: 'Simple Layout 24/7', modified: 'May 28, 2024 - 08:44 AM' },
    { id: 6, name: 'Simple Layout 9am to 5pm 24/7', modified: 'May 28, 2024 - 08:44 AM' },
];

const Schedules: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Schedule
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
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-gray-700">All Items</div>
                <div className="flex gap-4">
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {mockSchedules.map((schedule) => (
                        <tr key={schedule.id} className="hover:bg-gray-50 relative">
                            <td className="px-6 py-4">
                                <input type="checkbox" />
                            </td>
                            <td className="px-6 py-4">{schedule.name}</td>
                            <td className="px-6 py-4">{schedule.modified}</td>
                            <td className="px-6 py-4 text-right relative">
                                <button
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                    onClick={() => toggleDropdown(schedule.id)}
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                                {dropdownOpen === schedule.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <ul className="py-1">
                                            <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <Edit className="mr-2" /> Edit
                                            </li>
                                            <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <Copy className="mr-2" /> Duplicate
                                            </li>
                                            <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <ArrowUpRight className="mr-2" /> Takeover Screen
                                            </li>
                                            <li className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                <AlertCircle className="mr-2" /> Item Details
                                            </li>
                                            <li className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer">
                                                <Trash2 className="mr-2" /> Delete
                                            </li>
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

export default Schedules;