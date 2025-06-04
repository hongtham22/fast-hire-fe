"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { JobMatchingScore } from '@/types';

interface JobMatchingBreakdownChartProps {
  jobMatchingScores: JobMatchingScore[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullName: string;
      averageScore: number;
      total: number;
      highScore: number;
      mediumScore: number;
      lowScore: number;
    };
  }>;
}

export default function JobMatchingBreakdownChart({ jobMatchingScores }: JobMatchingBreakdownChartProps) {
  // Validate data
  if (!jobMatchingScores || !Array.isArray(jobMatchingScores) || jobMatchingScores.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Matching Score Distribution by Job</h3>
        <div className="h-[350px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No job matching data available</p>
            <p className="text-sm mt-1">Chart data is loading or unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for stacked bar chart
  const chartData = jobMatchingScores.map(job => ({
    name: job.jobTitle.length > 18 ? job.jobTitle.substring(0, 18) + '...' : job.jobTitle,
    fullName: job.jobTitle,
    highScore: job.highScoreCount,
    mediumScore: job.mediumScoreCount,
    lowScore: job.lowScoreCount,
    total: job.applicationsCount,
    averageScore: job.averageScore,
  }));

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Average Score: <span className="font-medium text-blue-600">{data.averageScore}%</span>
            </p>
            <p className="text-gray-600">
              Total Applications: <span className="font-medium">{data.total}</span>
            </p>
            <div className="border-t pt-2 mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-green-600">High Score (&gt;80%):</span>
                <span className="font-medium">{data.highScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">Medium Score (60-80%):</span>
                <span className="font-medium">{data.mediumScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Low Score (&lt;60%):</span>
                <span className="font-medium">{data.lowScore}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Matching Score Distribution by Job</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              width={70}
              label={{ value: 'Number of Applications', angle: -90, position: 'insideLeft', dx: 0 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            
            <Bar 
              dataKey="highScore" 
              stackId="a"
              fill="#059669" 
              name="High Score (&gt;80%)"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="mediumScore" 
              stackId="a"
              fill="#ca8a04" 
              name="Medium Score (60-80%)"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="lowScore" 
              stackId="a"
              fill="#dc2626" 
              name="Low Score (&lt;60%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 