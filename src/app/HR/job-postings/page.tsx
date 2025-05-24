"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2, Trash2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getJobsForHR, JobListItem, deleteJob } from "@/lib/api";
import { useRouter } from "next/navigation";
import CreateJobModal from "@/components/JobModal/CreateJobModal";
import EditJobModal from "@/components/JobModal/EditJobModal";
import { Job } from "@/app/context/JobsContext";

export default function JobPostingsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "closed" | "rejected">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const options: {
        page: number;
        limit: number;
        query?: string;
        status?: "pending" | "approved" | "closed" | "rejected";
      } = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchQuery) {
        options.query = searchQuery;
      }

      if (statusFilter !== "all") {
        options.status = statusFilter;
      }

      const response = await getJobsForHR(options);
      
      if (response.error) {
        setError(response.error);
      } else {
        setJobs(response.data?.jobs || []);
        setTotalJobs(response.data?.total || 0);
      }
    } catch (err) {
      setError("Failed to load job postings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const viewJobApplications = (jobId: string) => {
    router.push(`/HR/job-postings/${jobId}/applications`);
  };

  const handleJobCreated = () => {
    setCurrentPage(1); // Reset to first page when new job is created
    fetchJobs();
    setIsCreateModalOpen(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting? This will also delete all related keyword data.")) {
      return;
    }
    
    setDeleteLoading(jobId);
    setDeleteError(null);
    
    try {
      const response = await deleteJob(jobId);
      
      if (response.error) {
        setDeleteError(response.error);
      } else {
        // Refresh the job list
        fetchJobs();
      }
    } catch (err) {
      setDeleteError("Failed to delete job");
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to close this job posting?")) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/jobs/${jobId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          closeReason: 'manual' // Flag indicating HR closed this job manually
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to close job');
      }
      
      // Refresh the job list
      fetchJobs();
    } catch (err) {
      console.error('Error closing job:', err);
      setError('Failed to close job');
    }
  };

  const handleEditJob = async (job: JobListItem) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/jobs/${job.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const jobDetails = await response.json();
      setSelectedJob(jobDetails);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details for editing');
    }
  };

  const handleJobUpdated = async () => {
    try {
      // If job was pending and was edited, trigger keyword extraction
      if (selectedJob?.status === 'pending') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/jobs/${selectedJob.id}/extract-keywords`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to extract keywords');
        }
      }
      fetchJobs();
      setIsEditModalOpen(false);
      setSelectedJob(null);
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job');
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-gray-500">Manage your active and closed job postings</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Job Posting
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search job postings..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending' | 'closed' | 'rejected')}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="rounded-md bg-red-50 p-4 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{deleteError}</span>
        </div>
      )}
      
      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-7 gap-4 border-b bg-gray-50 px-6 py-3 font-medium">
          <div className="col-span-2">Position</div>
          <div>Location</div>
          <div>Created At</div>
          <div>Applications</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No job postings found. Create a new job posting to get started.
          </div>
        ) : (
          <div className="divide-y">
            {jobs.map((job) => (
              <div key={job.id} className="grid grid-cols-7 gap-4 px-6 py-4">
                <div className="col-span-2 font-medium">{job.jobTitle}</div>
                <div className="text-gray-600">{job.location}</div>
                <div className="text-gray-600"> {new Date(job.createdAt || "").toLocaleString()}</div>
                <div className="text-gray-600">{job.applicationCount}</div>
                <div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
                    {capitalizeFirstLetter(job.status)}
                  </span>
                </div>
                <div className="space-x-2 flex items-center">
                  {job.status === 'pending' && (
                    <button 
                      className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50 border-orange-primary"
                      onClick={() => handleEditJob(job)}
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50"
                    onClick={() => viewJobApplications(job.id)}
                  >
                    View
                  </button>
                  {job.status === 'approved' && (
                    <button 
                      className="rounded border border-yellow-500 bg-yellow-50 hover:bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600"
                      onClick={() => handleCloseJob(job.id)}
                    >
                      Close
                    </button>
                  )}
                  <button 
                    className="rounded border border-red-200 bg-red-50 hover:bg-red-100 px-2 py-1 text-xs font-medium text-red-600 flex items-center gap-1"
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deleteLoading === job.id}
                  >
                    {deleteLoading === job.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {totalJobs > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {jobs.length} of {totalJobs} job postings
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
      
      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <CreateJobModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {/* Edit Job Modal */}
      {selectedJob && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedJob(null);
          }}
          onJobUpdated={handleJobUpdated}
          job={selectedJob}
        />
      )}
    </div>
  );
} 