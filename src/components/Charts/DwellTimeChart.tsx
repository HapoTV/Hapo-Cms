import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DwellTimeChart({ data }: { data: Array<{ day: string; time: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
}