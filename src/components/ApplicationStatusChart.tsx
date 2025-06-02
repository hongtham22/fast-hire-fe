"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

const COLORS = [
  "#FF8C00", // cam đậm
  "#FFA500", // cam
  "#FFB84D", // cam nhạt
  "#FFD700", // vàng tươi
  "#FFECB3", // vàng nhạt
  "#BDBDBD", // xám trung tính
  "#E0E0E0", // xám nhạt
  "#F5F5F5", // trắng xám nhạt
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs text-gray-700 z-50">
        <p className="font-medium">{payload[0].name}</p>
        <p>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface ApplicationStatusChartProps {
  applications: Array<{
    status: string;
  }>;
}

const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({
  applications,
}) => {
  // Count applications by status
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for chart
  const data = [
    { name: "Accepted", value: statusCounts["accepted"] || 0, status: "accepted" },
    { name: "Rejected", value: statusCounts["rejected"] || 0, status: "rejected" },
    { name: "Not Evaluated", value: statusCounts["new"] || 0, status: "new" },
  ].filter(item => item.value > 0); // Only show statuses that have applications

  const totalApplications = applications.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return COLORS[0]; // cam đậm
      case "rejected":
        return COLORS[3]; // cam
      case "new":
        return COLORS[5]; // vàng tươi
      default:
        return COLORS[7]; // xám trung tính
    }
  };

  if (applications.length === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-gray-500 border rounded-lg bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Application Status</h3>
          <p>No applications available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-60 flex flex-col bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Application Status</h3>
      <div className="flex-1 flex flex-col">
        {/* Pie Chart */}
        <div className="flex-1 relative min-h-[120px] max-h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="relative z-30">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.status)}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <div className="text-lg font-semibold text-orange-500">
              {totalApplications}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>

        {/* Legend and Stats - Fixed height container */}
        <div className="h-16 flex flex-col justify-center gap-2 mt-2">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-700">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: getStatusColor(entry.status) }}
                />
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusChart; 