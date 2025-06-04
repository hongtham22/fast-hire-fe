'use client';

import { useState, useEffect } from 'react';
import JobTable from '@/components/admin/JobManagement/JobTable';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { getJobsForAdmin } from '@/lib/api';
import { JobListItem } from '@/types/job';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  jobTitle: string;
  location: {
    id: string;
    name: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'closed';
  createdAt: string;
  expireDate?: string | null;
  totalApplications: number;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getJobsForAdmin({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? (statusFilter as 'pending' | 'approved' | 'closed' | 'rejected') : undefined,
        query: searchQuery || undefined,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // Transform JobListItem to Job interface
        const transformedJobs: Job[] = response.data.jobs.map((job: JobListItem & { creator?: { id: string; name: string; email: string } }) => ({
          id: job.id,
          jobTitle: job.jobTitle,
          location: {
            id: '1', // Default location id
            name: job.location
          },
          creator: job.creator,
          status: job.status,
          createdAt: job.createdAt,
          expireDate: job.expireDate || undefined,
          totalApplications: job.applicationCount
        }));
        
        setJobs(transformedJobs);
        setTotalJobs(response.data.total || transformedJobs.length);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, currentPage]);

  const handleViewJob = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}`);
  };

  // Pagination helpers
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Jobs</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchJobs}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        <div className="text-sm text-gray-600">
          Total Jobs: {totalJobs}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search jobs by title, location, or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white shadow rounded-lg">
        <JobTable
          jobs={jobs}
          isLoading={loading}
          onViewDetails={handleViewJob}
        />
      </div>

      {/* Pagination */}
      {totalJobs > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {jobs.length} of {totalJobs} jobs
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
              className={`rounded border p-1 ${
                currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={loading}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              className={`rounded border p-1 ${
                currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 