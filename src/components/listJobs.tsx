import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePublicJobs } from '@/hooks/usePublicJobs';

function ListJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();
  const currentJobId = params.id as string;

  const { jobs, loading, error } = usePublicJobs({
    limit: 1000,
    query: searchTerm
  });

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    (job.jobTitle?.toLowerCase() || job.title?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase()) ||
    job.location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && jobs.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full sticky top-10">
        <div className="flex justify-center items-center h-40">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow h-full sticky top-10">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full sticky top-10">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Link
            key={job.id}
            href={`/careers/${job.id}`}
            className={`block p-4 rounded-lg transition-colors ${
              job.id === currentJobId
                ? 'bg-orange-50 border border-orange-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <h3 className="font-medium text-gray-900">
              {job.jobTitle || job.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{job.location.name}</p>
          </Link>
        ))}

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 py-4">No jobs found</p>
        )}
      </div>
    </div>
  );
}

export default ListJobs;