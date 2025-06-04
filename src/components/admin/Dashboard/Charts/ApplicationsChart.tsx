"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ApplicationsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export default function ApplicationsChart({ data }: ApplicationsChartProps) {
  // Validate data structure
  if (!data || !data.labels || !Array.isArray(data.labels) || !data.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Over Time (Last 30 Days)</h3>
        <div className="h-[300px] flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No application data available</p>
            <p className="text-sm mt-1">Chart data is loading or unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  // Additional validation for dataset structure
  const firstDataset = data.datasets[0];
  if (!firstDataset || !firstDataset.data || !Array.isArray(firstDataset.data)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Over Time (Last 30 Days)</h3>
        <div className="h-[300px] flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Invalid chart data structure</p>
            <p className="text-sm mt-1">Please check the data format</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.labels.map((label, index) => ({
    name: label,
    [firstDataset.label]: firstDataset.data[index] || 0
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Over Time (Last 30 Days)</h3>
      <div className="h-[300px] flex-1 flex items-end">
        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={Math.floor(chartData.length / 8)} 
              />
              <YAxis 
                allowDecimals={false}
                domain={[0, (dataMax: number) => dataMax + 1]}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={firstDataset.label}
                stroke={firstDataset.borderColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 