"use client"
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';

const COLORS = [
  '#FF8C00', // cam đậm
  '#FFA500', // cam
  '#FFB84D', // cam nhạt
  '#FFD700', // vàng tươi
  '#FFECB3', // vàng nhạt
  '#BDBDBD', // xám trung tính
  '#E0E0E0', // xám nhạt
  '#F5F5F5', // trắng xám nhạt
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
    { name: 'Role Match', value: roleScore },
    { name: 'Experience', value: expScore },
    { name: 'Programming', value: programmingScore },
    { name: 'Technical', value: technicalScore },
    { name: 'Soft Skills', value: softScore },
    { name: 'Languages', value: langsScore },
    { name: 'Keywords', value: keyScore },
    { name: 'Certifications', value: certScore },
  ];

  console.log(data);

  return (
    <div className="h-52 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xl font-semibold text-orange-500">{totalScore}%</div>
        <div className="text-xs text-gray-500">Total Match</div>
      </div>
    </div>
  );
};

export default MatchScoreChartInline;
