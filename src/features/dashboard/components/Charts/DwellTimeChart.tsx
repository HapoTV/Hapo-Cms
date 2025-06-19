// @ts-ignore
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { day: 'Mon', time: 45 },
  { day: 'Tue', time: 52 },
  { day: 'Wed', time: 48 },
  { day: 'Thu', time: 55 },
  { day: 'Fri', time: 59 },
  { day: 'Sat', time: 38 },
  { day: 'Sun', time: 32 },
];

export const DwellTimeChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="time" 
          stroke="#8B5CF6" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};