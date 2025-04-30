"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ListJobs from "@/app/components/listJobs";
import { useJobs } from "@/app/context/JobsContext";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";
import ApplicationModal from "@/app/components/ApplicationModal";
import KeywordAnalysisModal from "@/components/JD/KeywordAnalysisModal";

const JobDetailPage = () => {
  const {
    currentJob,
    fetchJobById,
    loading: contextLoading,
    refreshJobs,
  } = useJobs();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState(false);

  const params = useParams();
  const jobId = params.id as string;

  // Fetch job details using the context
  useEffect(() => {
    // Reset error state for new job ID
    setError("");

    const fetchData = async () => {
      if (!jobId) return;

      setLoading(true);
      try {
        const job = await fetchJobById(jobId);
        if (!job) {
          setError("Job not found or no longer available");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details. Please try again later.");

        // Try to refresh the job list if we encounter an error
        // This might help if the job was recently added but not cached
        refreshJobs().catch((e) =>
          console.error("Failed to refresh jobs list:", e)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, fetchJobById, refreshJobs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleApply = () => {
    // Open the application modal instead of navigation
    setIsModalOpen(true);
  };

  const handleViewKeywords = () => {
    setIsKeywordModalOpen(true);
  };

  // Show loading state only if both context is loading or local loading state is true
  if ((loading || contextLoading) && !error) {
    return (
      <div className="bg-gray-100 w-full h-full px-40 py-24 flex flex-row gap-10 justify-between">
        {/* Still show the job list while loading the details */}
        <div className="w-1/3 p-6 rounded-lg">
          <ListJobs />
        </div>

        <div className="w-2/3 p-6 rounded-lg flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="bg-gray-100 w-full h-full px-40 py-24 flex flex-row gap-10 justify-between">
        {/* Still show the job list even when there's an error */}
        <div className="w-1/3 p-6 rounded-lg">
          <ListJobs />
        </div>

        <div className="w-2/3 p-6 rounded-lg flex justify-center items-center">
          <div className="text-center max-w-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Job not found
            </h3>
            <p className="mt-2 text-base text-gray-500">
              {error || "We couldn't find the job you're looking for."}
            </p>
            <div className="mt-6">
              <Link
                href="/careers"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                View all jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use the job from context
  const job = currentJob;

  return (
    <>
      <div className="bg-gray-100 w-full h-full px-40 py-24">
        <div className="flex flex-row gap-10 justify-between">
          <div className="w-1/4 py-6 rounded-lg">
            <ListJobs />
          </div>
          <div className="w-3/4 p-6 rounded-lg relative overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title || job.jobTitle}
                    </h1>
                    <p className="text-gray-600 flex items-center">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      {job.location.name}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleViewKeywords}
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      View Keywords
                    </button>
                    <button
                      onClick={handleApply}
                      type="button"
                      className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[214px] xl:py-[15px] xl:pr-[55px] xl:w-[180px] bg-white group disabled:opacity-50"
                    >
                      <div className="absolute right-0 h-[500px] w-[500px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>
                      <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold">
                        Apply Now
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
                </div>

                <div className="mb-8 flex flex-wrap items-center text-sm text-gray-600">
                  <div className="mr-6 mb-2">
                    <span className="font-semibold">Posted:</span>{" "}
                    {formatDate(job.createdAt)}
                  </div>
                  {job.expireDate && (
                    <div className="mr-6 mb-2">
                      <span className="font-semibold">Closing Date:</span>{" "}
                      {formatDate(job.expireDate)}
                    </div>
                  )}
                  {job.experienceYear && (
                    <div className="mb-2">
                      <span className="font-semibold">Experience:</span>{" "}
                      {job.experienceYear}+ years
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Share job: ${job.jobTitle}`);
                    }}
                    className="ml-auto text-right inline-flex items-center gap-2 bg-gray-100 text-orange-primary p-2 rounded-full cursor-pointer transition duration-200 z-20 relative"
                  >
                    <IoShareSocialOutline className="w-7 h-7" />
                  </button>
                </div>
                <hr />
                <div className="m-8 space-y-12">
                  <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-orange-500 pb-2">
                      About FastHire
                    </h2>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      Get excited to create Life Media Platforms from Vietnam to
                      the World!
                      {"\n\n"}
                      At ZIGExN VeNtura, we&apos;re part of a larger vision driven by
                      ZIGExN Co., Ltd., a leading life media platform company in
                      Japan. Our parent company offers over 40 services in domains
                      like jobs, housing, cars, and travel. Recognized with
                      prestigious awards such as the Japan Technology Fast 50
                      (Deloitte, 2015) and named a Great Place to Work in Japan,
                      ZIGExN is now expanding its global impact.
                      {"\n\n"}
                      At ZIGExN VeNtura, we specialize in software development and
                      Internet services, building multi-product solutions based on
                      life media platforms. Our talented engineers in Ho Chi Minh,
                      Hanoi, and Da Nang collaborate to develop innovations that
                      make a difference.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-orange-500 pb-2">
                      Our Work
                    </h2>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      We act as a bridge between development teams in Vietnam and
                      clients in Japan.
                      {"\n\n"}
                      Through detailed discussions, negotiations, and document
                      analysis, we clarify client requirements and communicate
                      them effectively to the development team.
                      {"\n\n"}
                      We manage the...
                    </p>
                  </section>
                </div>

                <div className="m-8 space-y-12">
                  <section>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-orange-500 pb-2">
                      Job Description
                    </h2>

                    {job.keyResponsibility && (
                      <section>
                        <h3 className="text-xl font-semibold my-4 text-gray-900 border-b border-gray-300 pb-1">
                          Key Responsibilities
                        </h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {job.keyResponsibility}
                        </p>
                      </section>
                    )}

                    {job.mustHave && (
                      <section>
                        <h3 className="text-xl font-semibold my-4 text-gray-900 border-b border-gray-300 pb-1">
                          Must Have
                        </h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {job.mustHave}
                        </p>
                      </section>
                    )}

                    {job.niceToHave && (
                      <section>
                        <h3 className="text-xl font-semibold my-4 text-gray-900 border-b border-gray-300 pb-1">
                          Nice to Have
                        </h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {job.niceToHave}
                        </p>
                      </section>
                    )}

                    {job.languageSkills && (
                      <section>
                        <h3 className="text-xl font-semibold my-4 text-gray-900 border-b border-gray-300 pb-1">
                          Language Skills
                        </h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {job.languageSkills}
                        </p>
                      </section>
                    )}

                    {job.ourOffer && (
                      <section>
                        <h3 className="text-xl font-semibold my-4 text-gray-900 border-b border-gray-300 pb-1">
                          Our Offer
                        </h3>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {job.ourOffer}
                        </p>
                      </section>
                    )}
                  </section>
                </div>

                <div className="mt-10 pt-6">
                  <button
                    onClick={handleApply}
                    type="button"
                    className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[214px] xl:py-[15px] xl:pr-[55px] xl:w-[180px] bg-white group disabled:opacity-50"
                  >
                    <div className="absolute right-0 h-[500px] w-[500px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>
                    <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold">
                      Apply Now
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        jobTitle={job?.title || job?.jobTitle || ""}
        jobId={jobId}
      />

      {/* Keyword Analysis Modal */}
      <KeywordAnalysisModal
        isOpen={isKeywordModalOpen}
        onClose={() => setIsKeywordModalOpen(false)}
        jobId={jobId}
      />
    </>
  );
};

export default JobDetailPage;
