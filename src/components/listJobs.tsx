import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useJobs } from '../app/context/JobsContext';

function ListJobs() {
  const { jobs, loading, error } = useJobs();
  const params = useParams();
  const currentJobId = params.id as string;
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="bg-white p-4 rounded-lg shadow sticky top-28">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Open Positions</h2>
      
      {/* Search input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search positions..."
          className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        <svg
          className="w-4 h-4 absolute left-2 top-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Jobs count */}
      <div className="mb-3 text-sm text-gray-500">
        {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
      </div>
      
      {/* Jobs list */}
      <div className="overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-md">
            <p className="text-gray-500">No positions match your search</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-orange-600 hover:underline text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredJobs.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/careers/${job.id}`}
                  className={`block p-3 rounded-md transition-colors ${
                    job.id === currentJobId
                      ? "bg-orange-100 border-l-4 border-orange-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium text-gray-900 line-clamp-1">{job.jobTitle || job.title}</div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    {job.location.name}
                  </div>
                  {job.experienceYear && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.experienceYear}+ years
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Add a small explanation for users */}
      <p className="text-xs text-gray-400 mt-4 italic">
        Click on a position to view details
      </p>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ListJobs;