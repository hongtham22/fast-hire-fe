"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import JobKeywordView from "@/components/JD/JobKeywordView";
import { JobKeywordData } from "@/types/job";
import { getPublicJobKeywords } from "@/lib/api";
import { Job, useJobs } from "@/app/context/JobsContext";
import { formatDate } from "@/lib/utils";

export default function JobKeywordsPage() {
  const [keywordData, setKeywordData] = useState<JobKeywordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const { fetchJobById } = useJobs();
  
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;


  useEffect(() => {
    fetchJobKeywords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobKeywords = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobData = await fetchJobById(jobId);

      setJob(jobData);

      // Use the new API function that makes a direct call to the working endpoint
      const response = await getPublicJobKeywords(jobId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (!response.data) {
        setError("Keywords not found for this job");
        return;
      }

      setKeywordData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load job keywords. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Applications
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Job Keywords</h1>
        <p className="text-gray-500">
        {job?.jobTitle
            ? `Keywords and requirements for ${job?.jobTitle}`
            : "View job requirements and keywords"}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex w-full gap-8">
          <div className="w-1/2 p-4 overflow-y-auto border-r">
            <div className="mb-4 flex gap-6">
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Posted By:</span>{" "}
                  {job?.creator?.name}
                </p>
              </div>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {job?.creator?.email}
                </p>
              </div>
            </div>
            <div className="mb-8 flex flex-wrap items-center text-sm text-gray-600 gap-8">
              <div className="mb-2">
                <span className="font-semibold">Posted:</span>{" "}
                {formatDate(job?.createdAt || "")}
              </div>
              {job?.expireDate && (
                <div className="mb-2">
                  <span className="font-semibold">Closing Date:</span>{" "}
                  {formatDate(job.expireDate)}
                </div>
              )}
              {job?.experienceYear && (
                <div className="mb-2">
                  <span className="font-semibold">Experience:</span>{" "}
                  {job.experienceYear}+ years
                </div>
              )}
              {job?.location && (
                <div className="mb-2 flex items-center">
                  <span className="font-semibold mr-2">Location:</span>
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
                </div>
              )}
            </div>

            {/* Add Matching Score Weights */}
            {keywordData?.custom_max_scores && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Matching Score Weights</h3>
                <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.role_job}
                    </div>
                    <span>Job Title Match</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.experience_years}
                    </div>
                    <span>Experience Years</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.programming_language}
                    </div>
                    <span>Programming Languages</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.key_responsibilities}
                    </div>
                    <span>Key Responsibilities</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.certificate}
                    </div>
                    <span>Certificates</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.language}
                    </div>
                    <span>Languages</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.soft_skill}
                    </div>
                    <span>Soft Skills</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {keywordData.custom_max_scores.technical_skill}
                    </div>
                    <span>Technical Skills</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>Total weighting score: {Object.values(keywordData.custom_max_scores).reduce((sum, value) => sum + value, 0)} points</p>
                  <p>These weights represent the relative importance of each criterion when calculating candidate match scores.</p>
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold mb-4">Job Description</h3>
            {loading ? (
              <p>Loading job details...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">
                    Key Responsibilities
                  </h4>
                  <p className="whitespace-pre-line">
                    {job?.keyResponsibility}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold">Must Have</h4>
                  <p className="whitespace-pre-line">{job?.mustHave}</p>
                </div>

                {job?.niceToHave && (
                  <div>
                    <h4 className="text-lg font-semibold">Nice to Have</h4>
                    <p className="whitespace-pre-line">{job?.niceToHave}</p>
                  </div>
                )}

                {job?.languageSkills && (
                  <div>
                    <h4 className="text-lg font-semibold">Language Skills</h4>
                    <p className="whitespace-pre-line">{job?.languageSkills}</p>
                  </div>
                )}

                {job?.ourOffer && (
                  <div>
                    <h4 className="text-lg font-semibold">Our Offer</h4>
                    <p className="whitespace-pre-line">{job?.ourOffer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
            <JobKeywordView keywords={keywordData} />
          </div>
        </div>
      )}
    </div>
  );
}
