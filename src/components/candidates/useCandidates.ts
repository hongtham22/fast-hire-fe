import { useState, useEffect } from 'react';
import { getCandidatesForHR, getApplicationsByApplicantId } from '@/lib/api';
import { CandidateData } from '@/types';

interface ApplicationHistory {
  id: string;
  job: {
    id: string;
    jobTitle: string;
  };
  submittedAt: string;
  matchingScore: number | null;
  result: boolean | null;
  status: 'accepted' | 'rejected' | 'pending';
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterAndSortCandidates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates, searchQuery, sortBy]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCandidatesForHR();
      if (response.error) {
        setError(response.error);
      } else {
        setCandidates(response.data || []);
      }
    } catch {
      setError('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCandidates = () => {
    let filtered = [...candidates];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.technical_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort candidates
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'experience':
        filtered.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
        break;
      case 'applications':
        filtered.sort((a, b) => b.totalApplications - a.totalApplications);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.latestApplication.submittedAt).getTime() - new Date(a.latestApplication.submittedAt).getTime());
        break;
    }

    setFilteredCandidates(filtered);
  };

  const fetchApplicationHistory = async (candidateId: string): Promise<ApplicationHistory[]> => {
    try {
      const response = await getApplicationsByApplicantId(candidateId);
      if (response.error) {
        throw new Error(response.error);
      }
      
      const applications = response.data || [];
      return applications.map(app => ({
        id: app.id,
        job: {
          id: app.jobId,
          jobTitle: app.job?.jobTitle || 'Unknown Position'
        },
        submittedAt: app.submittedAt,
        matchingScore: app.matchingScore,
        result: app.result,
        status: app.result === true ? 'accepted' : app.result === false ? 'rejected' : 'pending'
      }));
    } catch {
      throw new Error('Failed to fetch application history');
    }
  };

  return {
    candidates,
    filteredCandidates,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setError,
    fetchApplicationHistory,
    refetch: fetchCandidates
  };
};

export type { ApplicationHistory }; 