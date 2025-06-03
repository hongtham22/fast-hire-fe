'use client';

import { useState, useEffect } from 'react';
import JobTable from '@/components/admin/JobManagement/JobTable';
import JobDetailsModal from '@/components/admin/JobManagement/JobDetailsModal';
import { Search, Filter } from 'lucide-react';
import { getJobsForAdmin, getJobDetail, getApplicationsByJobId } from '@/lib/api';
import { JobListItem } from '@/types/job';
import { Application } from '@/types/application';

interface ApplicationDisplay {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  matchingScore: number;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  resumeUrl: string;
}

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

interface JobDetails extends Job {
  mustHave: string;
  niceToHave: string;
  languageSkills: string;
  keyResponsibility: string;
  ourOffer: string;
  applications: ApplicationDisplay[];
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getJobsForAdmin({
        limit: 1000, // Get all jobs for admin
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
  }, [searchQuery, statusFilter]);

  const handleViewJob = async (jobId: string) => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobDetailResponse = await getJobDetail(jobId);
      if (jobDetailResponse.error) {
        throw new Error(jobDetailResponse.error);
      }

      // Fetch applications for this job
      const applicationsResponse = await getApplicationsByJobId(jobId);
      if (applicationsResponse.error) {
        console.warn('Could not fetch applications:', applicationsResponse.error);
      }

      if (jobDetailResponse.data) {
        const jobDetail = jobDetailResponse.data;
        const applications = applicationsResponse.data || [];
        
        // Find the job in our current list to get creator info
        const currentJob = jobs.find(j => j.id === jobId);
        
        const fullJobDetails: JobDetails = {
          id: jobDetail.id,
          jobTitle: jobDetail.jobTitle,
          location: jobDetail.location,
          creator: currentJob?.creator,
          status: (jobDetail.status as 'pending' | 'approved' | 'rejected' | 'closed') || 'pending',
          createdAt: jobDetail.createdAt || new Date().toISOString(),
          expireDate: jobDetail.expireDate || undefined,
          totalApplications: applications.length,
          mustHave: '', // These fields might not be in JobDetail type
          niceToHave: '',
          languageSkills: '',
          keyResponsibility: '',
          ourOffer: '',
          applications: applications.map((app: Application) => ({
            id: app.id,
            candidateName: app.applicant?.name || 'N/A',
            email: app.applicant?.email || 'N/A',
            phone: 'N/A', // Phone not available in basic Application type
            matchingScore: app.matchScore || 0,
            status: (app.status === 'new' ? 'pending' : app.status) as 'pending' | 'accepted' | 'rejected',
            appliedAt: app.createdAt || new Date().toISOString(),
            resumeUrl: app.cvFileUrl || ''
          }))
        };
        
        setSelectedJob(fullJobDetails);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (job.creator?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        <div className="text-sm text-gray-600">
          Total Jobs: {jobs.length}
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
          jobs={filteredJobs}
          isLoading={loading}
          onViewDetails={handleViewJob}
        />
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
} 