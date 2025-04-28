'use client';

import React, { useState } from 'react';
import MatchingResult from '@/components/MatchingResult';
import { evaluateMatching } from '@/lib/api';
import { MatchingResult as MatchingResultType, JobDescriptionData } from '@/types/api';

export default function MatchingPage() {
  const [cvText, setCvText] = useState('');
  const [jdData, setJdData] = useState('');
  const [matchingData, setMatchingData] = useState<MatchingResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedJdData = JSON.parse(jdData) as JobDescriptionData;
      
      const { data, error } = await evaluateMatching({
        cv_text: cvText,
        jd_data: parsedJdData,
      });
      
      if (error) {
        setError(error);
      } else if (data) {
        setMatchingData(data);
      }
    } catch (err) {
      // Handle JSON parsing errors
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CV-JD Matching Evaluation</h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV Text
          </label>
          <textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="w-full h-32 p-2 border rounded-md"
            placeholder="Paste CV text here..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description Data (JSON)
          </label>
          <textarea
            value={jdData}
            onChange={(e) => setJdData(e.target.value)}
            className="w-full h-32 p-2 border rounded-md font-mono"
            placeholder="Paste JD data in JSON format..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Evaluating...' : 'Evaluate Matching'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>

      {matchingData && (
        <MatchingResult
          score={matchingData.score}
          matches={matchingData.matches}
          total_must_have={matchingData.total_must_have}
          total_nice_to_have={matchingData.total_nice_to_have}
          matched_must_have={matchingData.matched_must_have}
          matched_nice_to_have={matchingData.matched_nice_to_have}
        />
      )}
    </div>
  );
} 