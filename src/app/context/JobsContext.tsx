"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define job interface
export interface Job {
  id: string;
  jobTitle: string;
  title?: string; // Handle different property names in API responses
  description: string;
  requirements?: string;
  experienceYear?: string;
  location: {
    id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  expireDate?: string;
  keyResponsibility?: string;
  mustHave?: string;
  niceToHave?: string;
  languageSkills?: string;
  ourOffer?: string;
}

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  currentJob: Job | null;
  setCurrentJob: (job: Job | null) => void;
  fetchJobById: (id: string) => Promise<Job | null>;
  refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);
  
  const CACHE_DURATION = 60000; // 1 minute cache

  const fetchJobs = async () => {
    // Check if we should fetch new data
    const now = Date.now();
    if (jobs.length > 0 && now - lastFetched < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Add a high limit parameter to get all jobs at once
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/jobs/open?limit=1000`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data.jobs);
      setLastFetched(now);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobById = async (id: string): Promise<Job | null> => {
    // First check if we already have the job in our list
    const cachedJob = jobs.find(job => job.id === id);
    if (cachedJob) {
      setCurrentJob(cachedJob);
      return cachedJob;
    }
    
    // If not found in cache, fetch from API
    try {
      setLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/jobs/${id}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job: ${response.status}`);
      }
      
      const job = await response.json();
      setCurrentJob(job);
      return job;
    } catch (err) {
      console.error(`Error fetching job with id ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    // Force refresh jobs list
    setLastFetched(0);
    await fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    jobs,
    loading,
    error,
    currentJob,
    setCurrentJob,
    fetchJobById,
    refreshJobs
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}; 