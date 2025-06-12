/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoLocationOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";


interface Job {
  id: string;
  jobTitle: string;
  description: string;
  experienceYear: string;
  location: {
    id: string;
    name: string;
  };
  requirements: string;
  status: string;
  createdAt: string;
}

interface Location {
  id: string;
  name: string;
}

const CareersContent = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(4);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    const page = 1;
    const locationId = searchParams.get("locationId") || "";
    const search = searchParams.get("search") || "";

    setSelectedLocation(locationId);
    setSearchQuery(search);
    setCurrentPage(page);

    fetchLocations();

    fetchJobs(page, limit, locationId, search, true);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setLoadingJobs(true);
      fetchJobs(1, limit, selectedLocation, searchQuery, true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedLocation]);


  const fetchLocations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`
      );
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchJobs = async (
    page: number,
    limit: number,
    locationId?: string,
    search?: string,
    resetJobs = false
  ) => {
    if (resetJobs) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/open?page=${page}&limit=${limit}`;
      if (locationId) url += `&locationId=${locationId}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (resetJobs) {
        setJobs(data.jobs);
      } else {
        setJobs((prev) => [...prev, ...data.jobs]);
      }

      setTotalJobs(data.total);
      setCurrentPage(page);
      const totalLoadedJobs = resetJobs ? data.jobs.length : jobs.length + data.jobs.length;
      setHasMore(totalLoadedJobs < data.total);
      
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setLoadingJobs(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    fetchJobs(currentPage + 1, limit, selectedLocation, searchQuery, false);
  };

  return (
    <div className="bg-gray-100 w-full h-full px-40 py-24">
      {/* Header */}
      <div className="flex flex-col my-20 overflow-hidden">
  <h1 className="text-[100px] font-bold opacity-0 animate-fade-in-up">
    Join our amazing team
  </h1>
  <h1 className="text-[100px] font-extrabold text-orange-dark opacity-0 animate-fade-in-up animation-delay-500">
    {totalJobs} job openings
  </h1>
</div>


      {/* Search + Jobs */}
      <div className="flex flex-row gap-28 justify-between">
        <div className="w-1/3 p-6 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-white py-3 px-4 rounded-lg border-2 border-transparent focus-within:border-black transition-all duration-200">
              <IoSearchOutline className="w-6 h-6" />
              <input
                type="text"
                placeholder="Search for job titles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-2 outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full p-4 py-5 pr-12 rounded-lg bg-white appearance-none border-2 border-transparent focus-within:border-black transition-all duration-200"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="absolute top-1/2 right-4 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Jobs list */}
        <div className="w-2/3 p-6 rounded-lg relative">
          {/* Overlay loading spinner */}
          {loadingJobs && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
              <div className="h-10 w-10 border-4 border-blue-600 border-r-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">
                No jobs found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                  fetchJobs(1, limit, "", "", true);
                }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
             <div
                className={`w-full flex flex-col gap-6 ${
                  loadingJobs ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() =>
                      (window.location.href = `/careers/${job.id}`)
                    }
                    className="group relative bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    {/* Semi-circular ripple effect */}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0 bg-orange-primary opacity-0 rounded-t-full transform -translate-x-1/2 transition-all ease-out duration-1000 group-hover:w-[300%] group-hover:h-[200%] group-hover:opacity-100"></span>

                    <div className="relative p-10 z-10 text-black group-hover:text-white transition-colors duration-1000">
                      <h2 className="text-4xl font-semibold mb-6">
                        {job.jobTitle}
                      </h2>
                      <div className="grid grid-cols-4 gap-4 items-center mb-6">
                        <div className="flex items-center text-gray-600 group-hover:text-white transition-colors duration-1000">
                          <IoLocationOutline className="w-5 h-5 mr-2" />
                          <span>{job.location.name}</span>
                        </div>
                        <div className="flex items-center text-gray-700 group-hover:text-white transition-colors duration-1000">
                          <span>{job.experienceYear}+ years</span>
                        </div>
                        <div></div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Share job: ${job.jobTitle}`);
                            }}
                            className="inline-flex items-center gap-2 bg-white text-orange-primary border-2 p-3 rounded-full cursor-pointer transition duration-200 z-20 relative"
                          >
                            <IoShareSocialOutline className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    type="button"
                    className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[214px] xl:py-[15px] xl:pr-[55px] xl:w-[235px] bg-white group disabled:opacity-50"
                  >
                    <div className="absolute right-0 h-[500px] w-[500px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>
                    <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold">
                      {loadingMore ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2 align-middle"></span>
                          Loading...
                        </>
                      ) : (
                        "Load More Jobs"
                      )}
                    </span>
                    <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 transform">
                      <div className="relative flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full transition-all duration-500 ease-in-out bg-orange-dark flex items-center justify-center group-hover:bg-white">
                          <IoArrowForwardOutline className="h-5 w-5 text-white group-hover:text-orange-dark transition-colors duration-500" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the component that uses useSearchParams with Suspense boundary
const CareersPage = () => {
  return (
    <Suspense fallback={<div className="bg-gray-100 w-full h-full px-40 py-24 flex items-center justify-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
    </div>}>
      <CareersContent />
    </Suspense>
  );
};

export default CareersPage;
