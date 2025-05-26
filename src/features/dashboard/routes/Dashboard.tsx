import React from 'react';
import { TrafficChart, DwellTimeChart } from '../components/Charts';
import { ScreenStatusCard } from '../components/ScreenStatusCard';
import { LocationMap } from '../components/LocationMap';

export const Dashboard = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold">Welcome back!</h2>
          <p>Here's your digital signage overview</p>
        </div>

        <LocationMap />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Traffic Analysis</h2>
          <div className="h-64">
            <TrafficChart />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-700 mb-4">Dwell Time</h2>
          <div className="h-64">
            <DwellTimeChart />
          </div>
        </div>
      </div>

      <ScreenStatusCard />
    </div>
  );
};