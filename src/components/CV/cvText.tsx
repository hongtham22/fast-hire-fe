"use client";
import React from 'react';

interface CVTextProps {
  cvText: string | null;
}

const CVText: React.FC<CVTextProps> = ({ cvText }) => {
  if (!cvText) return null;

  return (
    <div className="w-1/2 mt-8 bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">CV Content</h2>
      <div className="mt-40">
        <textarea
          className="w-full h-[800px] p-4 border border-gray-300 rounded-lg font-mono text-sm"
          value={cvText}
          readOnly
        />
      </div>
    </div>
  );
};

export default CVText; 