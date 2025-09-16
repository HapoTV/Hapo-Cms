// src/features/dashboard/components/Charts/TrafficChart.tsx

import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useTheme} from '../../../../contexts/ThemeContext'; // Corrected path to useTheme

const mockData = [
    {hour: '09:00', visitors: 120},
    {hour: '10:00', visitors: 200},
    {hour: '11:00', visitors: 150},
    {hour: '12:00', visitors: 300},
    {hour: '13:00', visitors: 280},
    {hour: '14:00', visitors: 250},
    {hour: '15:00', visitors: 180},
];

export const TrafficChart = () => {
    // CHANGED: Added useTheme hook to access theme colors
    const {currentTheme} = useTheme();

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={mockData}
                margin={{top: 5, right: 20, left: -10, bottom: 15}}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.colors.border.primary}/>
                <XAxis
                    dataKey="hour"
                    stroke={currentTheme.colors.text.secondary}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke={currentTheme.colors.text.secondary}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: currentTheme.colors.background.elevated,
                        borderColor: currentTheme.colors.border.secondary,
                        borderRadius: currentTheme.borderRadius.lg,
                    }}
                    cursor={{fill: currentTheme.colors.background.secondary}}
                />
                <Bar
                    dataKey="visitors"
                    // CHANGED: Fill color is now dynamically set from the theme
                    fill={currentTheme.colors.brand.primary}
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};