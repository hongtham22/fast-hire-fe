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
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { JobMatchingScore } from '@/types';

interface JobMatchingScoreChartProps {
  jobMatchingScores: JobMatchingScore[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      fullName: string;
      averageScore: number;
      applicationsCount: number;
      highScoreCount: number;
      mediumScoreCount: number;
      lowScoreCount: number;
    };
  }>;
  label?: string;
}

export default function JobMatchingScoreChart({ jobMatchingScores }: JobMatchingScoreChartProps) {
  // Validate data
  if (!jobMatchingScores || !Array.isArray(jobMatchingScores) || jobMatchingScores.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Matching Scores Overview</h3>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No job matching data available</p>
            <p className="text-sm mt-1">Chart data is loading or unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = jobMatchingScores.map(job => ({
    name: job.jobTitle.length > 15 ? job.jobTitle.substring(0, 15) + '...' : job.jobTitle,
    fullName: job.jobTitle,
    averageScore: job.averageScore,
    applicationsCount: job.applicationsCount,
    highScoreCount: job.highScoreCount,
    mediumScoreCount: job.mediumScoreCount,
    lowScoreCount: job.lowScoreCount,
  }));

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{data.fullName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Average Score: <span className="font-medium">{data.averageScore}%</span>
            </p>
            <p className="text-yellow-600">
              Total Applications: <span className="font-medium">{data.applicationsCount}</span>
            </p>
            <div className="border-t pt-2 mt-2">
              <p className="text-green-600">High Score (&gt;80%): {data.highScoreCount}</p>
              <p className="text-yellow-500">Medium Score (60-80%): {data.mediumScoreCount}</p>
              <p className="text-red-600">Low Score (&lt;60%): {data.lowScoreCount}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Job Matching Scores Overview</h3>
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
              yAxisId="score"
              orientation="left"
              label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <YAxis 
              yAxisId="count"
              orientation="right"
              label={{ value: 'Applications Count', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            
            {/* Reference lines for score thresholds */}
            <ReferenceLine yAxisId="score" y={80} stroke="#10b981" strokeDasharray="2 2" label="High Score" />
            <ReferenceLine yAxisId="score" y={60} stroke="#f59e0b" strokeDasharray="2 2" label="Medium Score" />
            
            <Bar 
              yAxisId="score"
              dataKey="averageScore" 
              fill="#3b82f6" 
              name="Average Score (%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="count"
              dataKey="applicationsCount" 
              fill="#fbbf24" 
              name="Applications Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 