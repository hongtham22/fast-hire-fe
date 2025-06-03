"use client";

import { useState, useEffect } from 'react';
import { Search, Check, X, Eye } from 'lucide-react';
import { getJobsForAdmin, getJobDetail, apiCall } from '@/lib/api';
import { Location, JobDetail, JobPosting } from '@/types/job';
import JobDetailsModal from '@/components/JobModal/JobDetailsModal';
import { formatDate } from '@/lib/utils';

// Type guard function to check if value is a Location object
function isLocationObject(value: unknown): value is Location {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
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
      const response = await getJobsForAdmin({
        status: 'pending',
        query: searchQuery
      });
      
      if (response.error) {
        setError(response.error);
      } else {
        // Transform the API response to match our JobPosting interface
        const transformedJobs = (response.data?.jobs || []).map(job => ({
          ...job,
          location: isLocationObject(job.location) 
            ? job.location 
            : { id: 'unknown', name: job.location as string }
        }));
        setJobs(transformedJobs);
      }
    } catch (err) {
      setError('Failed to load job postings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (jobId: string, jobTitle: string) => {
    // Add confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to approve the job "${jobTitle}"?`);
    if (!isConfirmed) return;

    try {
      const response = await apiCall(`/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response || !response.ok) {
        throw new Error('Failed to approve job');
      }

      // Show success alert
      alert(`Job "${jobTitle}" has been approved successfully!`);

      // Refresh the job list
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      console.error('Error approving job:', err);
      setError('Failed to approve job');
      alert('An error occurred while approving the job. Please try again!');
    }
  };

  const handleReject = async (jobId: string, jobTitle: string) => {
    // Add confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to reject the job "${jobTitle}"?`);
    if (!isConfirmed) return;

    try {
      const response = await apiCall(`/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (!response || !response.ok) {
        throw new Error('Failed to reject job');
      }

      // Show success alert
      alert(`Job "${jobTitle}" has been rejected!`);

      // Refresh the job list
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject job');
      alert('An error occurred while rejecting the job. Please try again!');
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
        // First create a variable with the API response data with type assertion
        const responseData = response.data as JobDetail & {
          maxScoreRoleJob?: number;
          maxScoreExperienceYears?: number;
          maxScoreProgrammingLanguage?: number;
          maxScoreKeyResponsibilities?: number;
          maxScoreCertificate?: number;
          maxScoreLanguage?: number;
          maxScoreSoftSkill?: number;
          maxScoreTechnicalSkill?: number;
        };
        
        const updatedJob: JobPosting = {
          ...job,
          ...responseData,
          // Ensure location is an object with id and name properties
          location: isLocationObject(responseData.location) 
            ? responseData.location 
            : { id: 'unknown', name: job.location.name },
          status: job.status, // Keep the original status to maintain type safety
          // Extract max score fields if they exist in the response
          maxScoreRoleJob: responseData.maxScoreRoleJob,
          maxScoreExperienceYears: responseData.maxScoreExperienceYears,
          maxScoreProgrammingLanguage: responseData.maxScoreProgrammingLanguage,
          maxScoreKeyResponsibilities: responseData.maxScoreKeyResponsibilities,
          maxScoreCertificate: responseData.maxScoreCertificate,
          maxScoreLanguage: responseData.maxScoreLanguage,
          maxScoreSoftSkill: responseData.maxScoreSoftSkill,
          maxScoreTechnicalSkill: responseData.maxScoreTechnicalSkill
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Approvals</h1>
        <div className="text-sm text-gray-600">
          Pending Jobs: {jobs.length}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700 border border-red-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6 flex items-center space-x-4">
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expire Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No pending jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{job.expireDate ? formatDate(job.expireDate) : 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.creator?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                        job.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : job.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {job.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(job.id, job.jobTitle)}
                              className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              title="Approve Job"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(job.id, job.jobTitle)}
                              className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              title="Reject Job"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
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
      <JobDetailsModal 
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApprove={(jobId) => handleApprove(jobId, selectedJob?.jobTitle || '')}
        onReject={(jobId) => handleReject(jobId, selectedJob?.jobTitle || '')}
      />
    </div>
  );
} 