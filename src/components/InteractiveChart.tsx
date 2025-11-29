import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ChartData {
  chart_type: string;
  title: string;
  x_column?: string;
  y_column?: string;
  data: Array<{ [key: string]: any }>;
  data_count: number;
}

interface InteractiveChartProps {
  chartData: ChartData;
}

const COLORS = ['#00A878', '#00c98c', '#0084d4', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95a5a6', '#f39c12', '#9b59b6', '#e74c3c'];

export function InteractiveChart({ chartData }: InteractiveChartProps) {
  const { chart_type, title, data, x_column, y_column } = chartData;

  const renderChart = () => {
    switch (chart_type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="x" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="y" 
              fill="#00A878" 
              name={y_column || 'Value'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="x"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#00A878" 
              strokeWidth={2}
              dot={{ fill: '#00c98c', r: 4 }}
              activeDot={{ r: 6 }}
              name={y_column || 'Value'} 
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                if (percent < 0.05) return ''; // Hide labels for very small slices
                return `${name}: ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, 'Value']}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => value}
            />
          </PieChart>
        );

      case 'histogram':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="x" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="y" 
              fill="#00A878" 
              name="Frequency"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'scatter':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="x" 
              type="number"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              type="number"
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#00A878" 
              strokeWidth={2}
              dot={{ fill: '#00c98c', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Unsupported chart type: {chart_type}</p>
          </div>
        );
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

