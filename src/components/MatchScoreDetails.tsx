import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface MatchScoreDetailsProps {
  score: number;
  scores: {
    roleScore: number;
    expScore: number;
    programmingScore: number;
    technicalScore: number;
    softScore: number;
    langsScore: number;
    keyScore: number;
    certScore: number;
  };
  children: React.ReactNode;
}

const COLORS = [
  '#FF8C00', // cam đậm
  '#FFA500', // cam
  '#FFB84D', // cam nhạt
  '#FFD700', // vàng tươi
  '#FFECB3', // vàng nhạt
  '#BDBDBD', // xám trung tính
  '#E0E0E0', // xám nhạt
  '#F5F5F5'  // trắng xám nhạt
];


export function MatchScoreDetails({ score, scores, children }: MatchScoreDetailsProps) {

  const data = [
    { name: 'Role Match', value: scores.roleScore },
    { name: 'Experience', value: scores.expScore },
    { name: 'Programming', value: scores.programmingScore },
    { name: 'Technical', value: scores.technicalScore },
    { name: 'Soft Skills', value: scores.softScore },
    { name: 'Languages', value: scores.langsScore },
    { name: 'Responsibilities', value: scores.keyScore },
    { name: 'Certifications', value: scores.certScore },
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs text-gray-700 z-40">
          <p className="font-medium">{payload[0].name}</p>
          <p>{`Score: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
        <h3 className="text-sm ml-4 mt-2 font-semibold text-gray-800">Match Score Breakdown</h3>
        <div className="h-52 relative ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="relative z-30">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <div className="text-xl font-semibold text-orange-500">{score}%</div>
            <div className="text-xs text-gray-500">Total Match</div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
