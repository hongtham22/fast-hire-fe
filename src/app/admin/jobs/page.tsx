'use client';

import { useState, useEffect } from 'react';
import JobTable from '@/components/admin/JobManagement/JobTable';
import JobDetailsModal from '@/components/admin/JobManagement/JobDetailsModal';
import { Search, Filter } from 'lucide-react';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  matchingScore: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
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
  experienceYear: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';
  createdAt: string;
  expireDate?: string;
  totalApplications: number;
}

interface JobDetails extends Job {
  mustHave: string;
  niceToHave: string;
  languageSkills: string;
  keyResponsibility: string;
  ourOffer: string;
  applications: Application[];
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJobs = async () => {
      try {
        // Simulated API response
        const mockJobs: Job[] = [
          {
            id: '1',
            jobTitle: 'Senior Frontend Developer',
            location: { id: '1', name: 'Ho Chi Minh City' },
            experienceYear: 5,
            status: 'approved',
            createdAt: '2024-03-15',
            expireDate: '2024-04-15',
            totalApplications: 12
          },
          // Add more mock jobs as needed
        ];
        setJobs(mockJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewJob = async (jobId: string) => {
    try {
      // TODO: Replace with actual API call to get full job details
      const fullJobDetails = await fetch(`/api/jobs/${jobId}`).then(res => res.json());
      setSelectedJob(fullJobDetails);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
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
            placeholder="Search jobs..."
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
            <option value="draft">Draft</option>
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