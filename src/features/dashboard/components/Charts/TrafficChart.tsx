import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { hour: '09:00', visitors: 120 },
  { hour: '10:00', visitors: 200 },
  { hour: '11:00', visitors: 150 },
  { hour: '12:00', visitors: 300 },
  { hour: '13:00', visitors: 280 },
  { hour: '14:00', visitors: 250 },
  { hour: '15:00', visitors: 180 },
];

export const TrafficChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="visitors" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};