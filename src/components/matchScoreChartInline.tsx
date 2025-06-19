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
        <p>{`Score: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

interface MatchScoreChartInlineProps {
  roleScore: number;
  expScore: number;
  programmingScore: number;
  technicalScore: number;
  softScore: number;
  langsScore: number;
  keyScore: number;
  certScore: number;
  totalScore: number;
}

const MatchScoreChartInline: React.FC<MatchScoreChartInlineProps> = ({
  roleScore,
  expScore,
  programmingScore,
  technicalScore,
  softScore,
  langsScore,
  keyScore,
  certScore,
  totalScore,
}) => {
  const data = [
    { name: "Role Match", value: parseFloat(roleScore.toFixed(2)) },
    { name: "Experience", value: parseFloat(expScore.toFixed(2)) },
    { name: "Programming", value: parseFloat(programmingScore.toFixed(2)) },
    { name: "Technical", value: parseFloat(technicalScore.toFixed(2)) },
    { name: "Soft Skills", value: parseFloat(softScore.toFixed(2)) },
    { name: "Languages", value: parseFloat(langsScore.toFixed(2)) },
    { name: "Responsibilities", value: parseFloat(keyScore.toFixed(2)) },
    { name: "Certifications", value: parseFloat(certScore.toFixed(2)) },
  ];

  return (
    <div className="h-60 flex flex-row items-center gap-4">
      {/* Pie Chart */}
      <div className="flex-1 relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="relative z-30">
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <div className="text-2xl font-semibold text-orange-500">
            {totalScore}%
          </div>
          <div className="text-sm text-gray-500">Total Match</div>
        </div>
      </div>

      {/* Legend bên trái */}
      <div className="w-1/3 text-sm text-gray-700 space-y-1">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchScoreChartInline;
