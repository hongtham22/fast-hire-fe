import { MatchScoreDetails } from "./MatchScoreDetails";

interface MatchScoreCircleProps {
  score: number;
  scores?: {
    roleScore: number;
    expScore: number;
    programmingScore: number;
    technicalScore: number;
    softScore: number;
    langsScore: number;
    keyScore: number;
    certScore: number;
  };
}


export default function MatchScoreCircle({ score, scores }: MatchScoreCircleProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const circle = (
    <div className="relative flex h-12 w-12 items-center justify-center cursor-pointer">
      <svg className="h-12 w-12 -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
        />
        <circle
          className={getScoreColor(score)}
          strokeWidth="6"
          strokeDasharray={125.6}
          strokeDashoffset={125.6 - (125.6 * score) / 100}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
        />
      </svg>
      <span className={`absolute text-sm font-semibold ${getScoreColor(score)}`}>
        {score}%
      </span>
    </div>
  );

  if (!scores) {
    return circle;
  }

  return (
    <MatchScoreDetails score={score} scores={scores}>
      {circle}
    </MatchScoreDetails>
  );
} 