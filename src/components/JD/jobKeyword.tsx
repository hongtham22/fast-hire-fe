"use client";
import React from "react";

interface JobKeywordProps {
  keywords: { [category: string]: string[] } | null;
}

const JobKeyword: React.FC<JobKeywordProps> = ({ keywords }) => {
  if (!keywords) return null;

  return (
    <div className="w-1/2 mt-8 bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Raw Response Data</h2>
      <textarea
        className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm"
        value={JSON.stringify(keywords, null, 2)}
        readOnly
      />
    </div>
  );
};

export default JobKeyword;