// src/features/dashboard/components/Charts/DwellTimeChart.tsx

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useTheme} from '../../../../contexts/ThemeContext'; // Corrected path to useTheme

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
    // CHANGED: Added useTheme hook to access theme colors
    const {currentTheme} = useTheme();

  return (
      <ResponsiveContainer width="100%" height={300}>
          <LineChart
              data={mockData}
              margin={{top: 5, right: 20, left: -10, bottom: 15}}
          >
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.colors.border.primary}/>
              <XAxis
                  dataKey="day"
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
                  cursor={{stroke: currentTheme.colors.border.secondary}}
              />
        <Line
            type="monotone"
            dataKey="time"
            // CHANGED: Stroke color is now dynamically set from the theme's accent color
            stroke={currentTheme.colors.brand.accent}
          strokeWidth={2}
            dot={{r: 4, fill: currentTheme.colors.brand.accent}}
            activeDot={{r: 6, stroke: currentTheme.colors.background.primary}}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};