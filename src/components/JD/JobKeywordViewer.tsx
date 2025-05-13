"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getPublicJobKeywords } from "@/lib/api";
import { JobKeywordData } from "@/types/job";

interface JobKeywordViewerProps {
  jobId: string;
}

const JobKeywordViewer: React.FC<JobKeywordViewerProps> = ({ jobId }) => {
  const [keywords, setKeywords] = useState<JobKeywordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await getPublicJobKeywords(jobId);
      
      if (error) {
        setError(error);
      } else if (data) {
        setKeywords(data);
      }
      
      setLoading(false);
    };

    if (jobId) {
      fetchKeywords();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 size={40} className="animate-spin text-orange-600" />
        <p className="mt-4 text-gray-600">Loading job keywords...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md">
        <p className="font-semibold">Error loading keywords:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!keywords) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No keywords have been extracted for this job yet.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCategoryValue = (category: string, value: any) => {
    // Handle different types of values based on category
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return <p className="text-gray-500 italic">No data</p>;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      // Single object with value and requirement_type
      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded text-sm ${value.requirement_type === 'must_have' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {value.value}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            ({value.requirement_type})
          </span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <div key={index} className="flex items-center">
              <span className={`px-2 py-1 rounded text-sm ${item.requirement_type === 'must_have' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {item.value}
              </span>
              <span className="ml-1 text-xs text-gray-500">
                ({item.requirement_type})
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Default fallback
    return <p>{JSON.stringify(value)}</p>;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 overflow-auto">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Extracted Keywords</h2>
      
      <div className="space-y-6">
        {Object.entries(keywords).map(([category, value]) => (
          <div key={category} className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <div className="ml-4">
              {renderCategoryValue(category, value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobKeywordViewer; 