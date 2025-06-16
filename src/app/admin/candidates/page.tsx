'use client';

import { useState, useEffect } from 'react';
import { CandidateData } from '@/types';
import AdminCandidateFilters from '@/components/candidates/AdminCandidateFilters';
import CandidatesTable from '@/components/candidates/CandidatesTable';
import ApplicationHistoryModal from '@/components/candidates/ApplicationHistoryModal';
import { useAdminCandidates } from '@/components/candidates/useAdminCandidates';
import { Card } from '@/components/ui/card';
import { Users, BriefcaseIcon, Award, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { getApplicantStatistics, ApplicantStatistics } from '@/lib/api';

export default function AdminCandidatesPage() {
  const {
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
    fetchApplicationHistory
  } = useAdminCandidates();

  // Statistics state
  const [statistics, setStatistics] = useState<ApplicantStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when search query, sort, or HR selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, selectedHrId]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination helpers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a range of pages
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  // Fetch statistics (admin gets global statistics)
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getApplicantStatistics();
        if (response.error) {
          console.error('Failed to fetch statistics:', response.error);
          setError('Failed to load statistics');
        } else {
          setStatistics(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, [setError]);

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

  // Get the selected HR user name for display
  const getSelectedHrName = () => {
    if (selectedHrId === 'all') return 'All HR Users';
    const selectedHr = hrUsers.find(hr => hr.id === selectedHrId);
    return selectedHr?.name || 'Unknown HR';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Candidates</h1>
          <p className="text-gray-500">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Candidates</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">All Candidates</h1>
        <p className="text-gray-500">
          Manage all candidates from all HR users
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? '...' : statistics?.totalApplicants || 0}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Building2 className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active HR Users</p>
              <h3 className="text-2xl font-bold">
                {hrUsers.length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <BriefcaseIcon className="h-6 w-6 text-orange-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Multiple Applications</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? '...' : statistics?.multipleApplicationsCount || 0}
              </h3>
              <p className="text-xs text-gray-500">(2+ applications)</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">High Match Rate</p>
              <h3 className="text-2xl font-bold">
                {statsLoading ? '...' : statistics?.highMatchingCount || 0}
              </h3>
              <p className="text-xs text-gray-500">(≥80% match score)</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Filters */}
      <AdminCandidateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedHrId={selectedHrId}
        onHrChange={setSelectedHrId}
        hrUsers={hrUsers}
      />
      
      {/* Candidates Table */}
      <Card>
        <CandidatesTable
          candidates={paginatedCandidates}
          onViewHistory={handleViewHistory}
        />
        
        {filteredCandidates.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {paginatedCandidates.length} of {filteredCandidates.length} candidates
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedHrId !== 'all' && ` from ${getSelectedHrName()}`}
            </div>
            
            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || loading}
                className={`rounded-md border border-gray-300 p-1 ${
                  currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  disabled={loading}
                  className={`rounded-md px-3 py-1 text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className={`rounded-md border border-gray-300 p-1 ${
                  currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {filteredCandidates.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            No candidates found
          </div>
        )}
      </Card>

      {/* Application History Modal */}
      <ApplicationHistoryModal
        isOpen={showHistoryModal}
        onClose={handleCloseModal}
        candidate={selectedCandidate ? {
          id: selectedCandidate.id,
          name: selectedCandidate.name,
          email: selectedCandidate.email
        } : null}
        fetchApplicationHistory={fetchApplicationHistory}
        onError={setError}
      />
    </div>
  );
} 