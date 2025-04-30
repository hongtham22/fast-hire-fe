"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import JobKeywordView from '@/components/JD/JobKeywordView';
import { JobKeywordData } from '@/types/job';
import { getJobsForHR, getPublicJobKeywords } from '@/lib/api';

export default function JobKeywordsPage() {
  const [keywordData, setKeywordData] = useState<JobKeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  useEffect(() => {
    fetchJobKeywords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);
  
  const fetchJobKeywords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the job title first
      const jobResponse = await getJobsForHR({
        query: jobId
      });

      if (jobResponse.data?.jobs?.[0]?.jobTitle) {
        setJobTitle(jobResponse.data.jobs[0].jobTitle);
      }
      
      // Use the new API function that makes a direct call to the working endpoint
      const response = await getPublicJobKeywords(jobId);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (!response.data) {
        setError('Keywords not found for this job');
        return;
      }
      
      // Set the keywords data
      setKeywordData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load job keywords. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Job Keywords</h1>
        <p className="text-gray-500">
          {jobTitle ? `Keywords and requirements for ${jobTitle}` : 'View job requirements and keywords'}
        </p>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <JobKeywordView keywords={keywordData} />
      )}
    </div>
  );
} 