import React from 'react';
import { MatchField, MatchingResult as MatchingResultType } from '@/types/api';

interface MatchingResultProps extends Omit<MatchingResultType, 'matches'> {
  matches: {
    must_have: MatchField[];
    nice_to_have: MatchField[];
  };
}

const MatchingResult: React.FC<MatchingResultProps> = ({
  score,
  matches,
  total_must_have,
  total_nice_to_have,
  matched_must_have,
  matched_nice_to_have,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Matching Score</h2>
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">{score}%</span>
          </div>
          <div className="ml-6">
            <p className="text-gray-600">
              Must-have matches: {matched_must_have}/{total_must_have}
            </p>
            <p className="text-gray-600">
              Nice-to-have matches: {matched_nice_to_have}/{total_nice_to_have}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-red-600">Must-Have Matches</h3>
          <div className="space-y-2">
            {matches.must_have.map((match, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-md">
                <p className="font-medium">{match.field}</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-sm text-gray-500">CV Value:</p>
                    <p>{match.cv_value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JD Value:</p>
                    <p>{match.jd_value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-green-600">Nice-to-Have Matches</h3>
          <div className="space-y-2">
            {matches.nice_to_have.map((match, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-md">
                <p className="font-medium">{match.field}</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <p className="text-sm text-gray-500">CV Value:</p>
                    <p>{match.cv_value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JD Value:</p>
                    <p>{match.jd_value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingResult; 