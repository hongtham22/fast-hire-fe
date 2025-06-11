import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { apiCall } from '@/lib/api';

export const useJobDetail = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await apiCall(`/jobs/${jobId}`);
        
        if (!response || !response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
}; 