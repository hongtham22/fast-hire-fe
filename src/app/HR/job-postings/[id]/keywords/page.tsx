"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import JobKeywordView from "@/components/JD/JobKeywordView";
import { JobKeywordData } from "@/types/job";
import { getPublicJobKeywords } from "@/lib/api";
import { useJobDetail } from "@/hooks/useJobDetail";

export default function JobKeywordsPage() {
  const [keywordData, setKeywordData] = useState<JobKeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { job, loading: jobLoading } = useJobDetail(jobId);

  useEffect(() => {
    fetchJobKeywords();
  }, [jobId]);

  const fetchJobKeywords = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPublicJobKeywords(jobId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (!response.data) {
        setError("Keywords not found for this job");
        return;
      }

      setKeywordData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load job keywords. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-600">{error || "Job not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-red-600 hover:text-red-700"
          >
            <ArrowLeft className="h-4 w-4 inline mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Applications
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Job Keywords</h1>
        <p className="text-gray-500">
          Keywords and requirements for {job.jobTitle}
        </p>
      </div>

      {keywordData && <JobKeywordView data={keywordData} />}
    </div>
  );
}
