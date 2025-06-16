import { useState, useEffect } from 'react';
import { getAllCandidatesForAdmin, getApplicationsByApplicantId, getAllUsers } from '@/lib/api';
import { CandidateData, HRUser } from '@/types';

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

export const useAdminCandidates = () => {
  const [candidates, setCandidates] = useState<CandidateData[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateData[]>([]);
  const [hrUsers, setHrUsers] = useState<HRUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedHrId, setSelectedHrId] = useState<string>('all');

  useEffect(() => {
    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCandidates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHrId]);

  useEffect(() => {
    filterAndSortCandidates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates, searchQuery, sortBy]);

  const fetchInitialData = async () => {
    try {
      const hrResponse = await getAllUsers(false); // Only active users
      if (hrResponse.error) {
        setError(hrResponse.error);
      } else {
        // Filter only HR users
        const hrOnlyUsers = (hrResponse.data || []).filter(user => user.role === 'hr');
        setHrUsers(hrOnlyUsers);
      }
    } catch {
      setError('Failed to fetch HR users');
    }
    
    // Fetch all candidates initially
    fetchCandidates();
  };

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const hrUserId = selectedHrId === 'all' ? undefined : selectedHrId;
      const response = await getAllCandidatesForAdmin(hrUserId);
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

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((candidate) =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.latestApplication.jobTitle.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => 
          new Date(b.latestApplication.submittedAt).getTime() - 
          new Date(a.latestApplication.submittedAt).getTime()
        );
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'applications':
        filtered.sort((a, b) => b.totalApplications - a.totalApplications);
        break;
      case 'score':
        filtered.sort((a, b) => {
          const scoreA = a.latestApplication.matchingScore || 0;
          const scoreB = b.latestApplication.matchingScore || 0;
          return scoreB - scoreA;
        });
        break;
      default:
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
    hrUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedHrId,
    setSelectedHrId,
    setError,
    fetchApplicationHistory,
    refetch: fetchCandidates
  };
}; 