"use client";

import { useState, useEffect } from 'react';
import { 
  Search,
  Check,
  X,
  Eye,
} from 'lucide-react';
import { getJobsForHR, getJobDetail, JobListItem } from '@/lib/api';

interface JobPosting extends JobListItem {
  location: {
    id: string;
    name: string;
  };
  experienceYear?: number;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  mustHave?: string;
  niceToHave?: string;
  languageSkills?: string;
  keyResponsibility?: string;
  ourOffer?: string;
}

export default function JobApprovals() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getJobsForHR({
        status: 'pending',
        query: searchQuery
      });
      
      if (response.error) {
        setError(response.error);
      } else {
        setJobs(response.data?.jobs || []);
      }
    } catch (err) {
      setError('Failed to load job postings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve job');
      }

      // Refresh the job list
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      console.error('Error approving job:', err);
      setError('Failed to approve job');
    }
  };

  const handleReject = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (!response.ok) {
        throw new Error('Failed to reject job');
      }

      // Refresh the job list
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject job');
    }
  };

  const handleViewDetails = async (job: JobPosting) => {
    try {
      const response = await getJobDetail(job.id);
      if (response.error) {
        throw new Error(response.error);
      }
      // Keep the existing job data if the API response is missing required fields
      if (response.data) {
        const updatedJob: JobPosting = {
          ...job,
          ...response.data,
          // Ensure location is an object with id and name properties
          location: response.data.location && typeof response.data.location === 'object' 
            ? response.data.location 
            : job.location,
          status: job.status // Keep the original status to maintain type safety
        };
        setSelectedJob(updatedJob);
      } else {
        setSelectedJob(job);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Approvals</h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search jobs..."
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.experienceYear ? `${job.experienceYear} years` : 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.creator?.name || 'HR Manager'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        job.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : job.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                        {job.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(job.id)}
                              className="text-green-400 hover:text-green-500"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(job.id)}
                              className="text-red-400 hover:text-red-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">Job Details</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedJob.jobTitle}</h3>
                <p className="text-sm text-gray-500">{selectedJob.location.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p className="text-sm text-gray-900">{selectedJob.experienceYear ? `${selectedJob.experienceYear} years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created By</p>
                  <p className="text-sm text-gray-900">{selectedJob.creator?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedJob.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">{selectedJob.status}</p>
                </div>
              </div>
              
              {selectedJob.mustHave && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Must Have</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.mustHave}</p>
                </div>
              )}
              
              {selectedJob.niceToHave && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Nice to Have</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.niceToHave}</p>
                </div>
              )}
              
              {selectedJob.languageSkills && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Language Skills</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.languageSkills}</p>
                </div>
              )}
              
              {selectedJob.keyResponsibility && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Key Responsibilities</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.keyResponsibility}</p>
                </div>
              )}
              
              {selectedJob.ourOffer && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Our Offer</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.ourOffer}</p>
                </div>
              )}

              {selectedJob.status === 'pending' && (
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleReject(selectedJob.id)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedJob.id)}
                    className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 