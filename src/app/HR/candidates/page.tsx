'use client';

import { useState } from 'react';
import { CandidateData } from '@/types';
import CandidateFilters from '@/components/candidates/CandidateFilters';
import CandidatesTable from '@/components/candidates/CandidatesTable';
import ApplicationHistoryModal from '@/components/candidates/ApplicationHistoryModal';
import { useCandidates } from '@/components/candidates/useCandidates';

export default function CandidatesPage() {
  const {
    filteredCandidates,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    setError,
    fetchApplicationHistory
  } = useCandidates();

  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleViewHistory = (candidate: CandidateData) => {
    setSelectedCandidate(candidate);
    setShowHistoryModal(true);
  };

  const handleCloseModal = () => {
    setShowHistoryModal(false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-gray-500">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-gray-500">Manage candidates who applied to your job postings</p>
      </div>
      
      {/* Filters */}
      <CandidateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      {/* Candidates Table */}
      <CandidatesTable
        candidates={filteredCandidates}
        onViewHistory={handleViewHistory}
      />

      {/* Application History Modal */}
      <ApplicationHistoryModal
        isOpen={showHistoryModal}
        onClose={handleCloseModal}
        candidate={selectedCandidate}
        fetchApplicationHistory={fetchApplicationHistory}
        onError={setError}
      />
    </div>
  );
} 