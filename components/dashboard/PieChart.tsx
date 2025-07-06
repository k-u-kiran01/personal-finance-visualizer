import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCategoryColor, getCategoryLabel } from '@/lib/categories';

interface PieChartProps {
  data: Array<{
    category: string;
    amount: number;
  }>;
}

export function PieChart({ data }: PieChartProps) {
  const chartData = data.map(item => ({
    name: getCategoryLabel(item.category as any),
    value: item.amount,
    color: getCategoryColor(item.category as any),
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
            labelFormatter={(label) => label}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
} 