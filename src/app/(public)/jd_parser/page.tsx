"use client";
import JobEditor from '@/components/JD/jobEditor'
import JobKeyword from '@/components/JD/jobKeyword'
import React, { useState, useCallback } from 'react'
import Link from 'next/link';
import { JobKeywordData } from '@/types/job';
import { JobDescriptionData } from '@/types/api';

function Page() {
  // Keep track of the parsed job description data
  const [keywordData, setKeywordData] = useState<JobKeywordData | null>(null);
  
  // Create a handler function that will convert JobDescriptionData to JobKeywordData
  const handleJobDataParsed = useCallback((data: JobDescriptionData | null) => {
    // For now, assume the backend is directly returning JobKeywordData
    // In a real implementation, you might need to transform the data
    setKeywordData(data as unknown as JobKeywordData);
  }, []);
  
  return (
    <div className="bg-gray-100 w-full flex flex-col gap-8 pt-[80px] pb-20 px-12">
      <Link href="/cv_parser" className="text-md font-bold text-emerald-500 pt-2">
        &gt;&gt;&gt; Link to CV Parser
      </Link>
      <div className="flex flex-row gap-6">
        <JobEditor setKeywords={handleJobDataParsed} />
        <JobKeyword keywords={keywordData} />
      </div>
    </div>
  )
}

export default Page