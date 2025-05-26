import React from 'react';

const Dashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Changes pushed</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold">Hi, <span className="font-bold">Petlo</span></h2>
                    <p>A fresh Dashboard greets you today!</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Screen Locations</h2>
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p>Map Placeholder</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Screen Status</h2>
                <ul className="space-y-2">
                    <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
                        <span>Online</span>
                        <span>5</span>
                    </li>
                    <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
                        <span>Offline</span>
                        <span>3</span>
                    </li>
                    <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
                        <span>Registered</span>
                        <span>8</span>
                    </li>
                    <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
                        <span>Unregistered</span>
                        <span>0</span>
                    </li>
                    <li className="flex justify-between bg-gray-100 p-2 rounded-lg">
                        <span>Device Quota</span>
                        <span>8</span>
                    </li>
                </ul>
                <div className="mt-4">
                    <a href="#" className="text-blue-500 hover:underline">Manage Screens</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;