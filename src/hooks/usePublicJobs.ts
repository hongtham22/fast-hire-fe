import { useState, useEffect } from 'react';
import { Job, JobFilters, JobListResponse } from '@/types/job';
import { apiCall } from '@/lib/api';

export const usePublicJobs = (filters: JobFilters) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.query) queryParams.append('query', filters.query);
        if (filters.locationId) queryParams.append('locationId', filters.locationId);
        
        const response = await apiCall(`/jobs/open?${queryParams.toString()}`);
        
        if (!response || !response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data: JobListResponse = await response.json();
        setJobs(data.jobs);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters.page, filters.limit, filters.query, filters.locationId]);

  return { jobs, total, loading, error };
}; 