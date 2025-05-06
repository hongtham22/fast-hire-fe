"use client";

import { useState } from "react";
import MatchScoreCircle from "@/components/MatchScoreCircle";

export default function MatchScoreDemoPage() {
  const [score, setScore] = useState(75);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Match Score Circle Component Demo</h1>
      
      <div className="grid grid-cols-4 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <MatchScoreCircle score={95} />
          <p className="mt-2 text-sm text-gray-600">95%</p>
        </div>
        <div className="flex flex-col items-center">
          <MatchScoreCircle score={85} />
          <p className="mt-2 text-sm text-gray-600">85%</p>
        </div>
        <div className="flex flex-col items-center">
          <MatchScoreCircle score={65} />
          <p className="mt-2 text-sm text-gray-600">65%</p>
        </div>
        <div className="flex flex-col items-center">
          <MatchScoreCircle score={35} />
          <p className="mt-2 text-sm text-gray-600">35%</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Interactive Demo</h2>
        <div className="flex items-center gap-4 mb-6">
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-64"
          />
          <span className="text-sm font-medium">{score}%</span>
        </div>
        
        <div className="flex justify-center">
          <MatchScoreCircle score={score} size={100} />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Usage:</h3>
        <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
          {`import MatchScoreCircle from "@/components/MatchScoreCircle";

// Basic usage
<MatchScoreCircle score={85} />

// Custom size (in pixels)
<MatchScoreCircle score={75} size={100} />`}
        </pre>
      </div>
    </div>
  );
} 