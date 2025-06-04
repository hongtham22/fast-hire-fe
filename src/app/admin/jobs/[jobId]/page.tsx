"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { getJobDetail, getApplicationsByJobId } from "@/lib/api";
import {
  Application,
  ApplicationApiResponse,
  ApplicationWithCV,
} from "@/types/application";
import { JobPosting } from "@/types/job";
import MatchScoreCircle from "@/components/MatchScoreCircle";
import ApplicationStatusChart from "@/components/ApplicationStatusChart";
import { formatDate } from "@/lib/utils";

export default function AdminJobDetailPage() {
  // Job data state
  const [job, setJob] = useState<JobPosting | null>(null);

  // Applications state
  const [applications, setApplications] = useState<ApplicationWithCV[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "applications">(
    "details"
  );

  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  useEffect(() => {
    fetchJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJobData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch job details, applications, and keywords in parallel
      const [jobResponse, applicationsResponse] = await Promise.all([
        getJobDetail(jobId),
        getApplicationsByJobId(jobId),
      ]);

      // Handle job details
      if (jobResponse.error) {
        throw new Error(jobResponse.error);
      }

      if (jobResponse.data) {
        // Cast the job data to JobPosting type as it contains all required fields
        setJob(jobResponse.data as unknown as JobPosting);
      }

      // Handle applications
      if (applicationsResponse.error) {
        console.warn(
          "Could not fetch applications:",
          applicationsResponse.error
        );
      } else {
        // Process applications data
        let applicationsData: ApplicationWithCV[] = [];

        if (Array.isArray(applicationsResponse.data)) {
          // Extract the backend response and convert to our Application type
          const apiResponse =
            applicationsResponse.data as unknown as ApplicationApiResponse[];

          // Map the API response to our Application interface
          applicationsData = apiResponse.map((item) => {
            // Map result (boolean | null) to status string
            let status: Application["status"];
            if (item.result === true) {
              status = "accepted";
            } else if (item.result === false) {
              status = "rejected";
            } else {
              status = "new";
            }

            // Format the application to match our Application interface
            return {
              id: item.id,
              applicant: {
                id: item.applicant?.id || item.applicantId || "",
                name: item.applicant?.name || "Unknown",
                email: item.applicant?.email || "No email provided",
              },
              job: {
                id: item.jobId || "",
                jobTitle: item.job?.jobTitle || "Unknown Position",
              },
              matchScore:
                item.matchingScore !== null
                  ? Math.floor(Number(item.matchingScore))
                  : undefined,
              status: status,
              createdAt: item.submittedAt || new Date().toISOString(),
              cvFileUrl: item.cvFileUrl,
              missingFeedback: item.missingFeedback,
              matchingScore:
                item.matchingScore !== null
                  ? Number(item.matchingScore)
                  : undefined,
              roleScore:
                item.roleScore !== null ? Number(item.roleScore) : undefined,
              expScore:
                item.expScore !== null ? Number(item.expScore) : undefined,
              programmingScore:
                item.programmingScore !== null
                  ? Number(item.programmingScore)
                  : undefined,
              technicalScore:
                item.technicalScore !== null
                  ? Number(item.technicalScore)
                  : undefined,
              softScore:
                item.softScore !== null ? Number(item.softScore) : undefined,
              langsScore:
                item.langsScore !== null ? Number(item.langsScore) : undefined,
              keyScore:
                item.keyScore !== null ? Number(item.keyScore) : undefined,
              certScore:
                item.certScore !== null ? Number(item.certScore) : undefined,
              skills: item.skills || [],
              technical_skills: item.technical_skills || [],
              languages: item.languages || [],
              education: item.education || [],
              latest_company: item.latest_company || null,
              experience_years: item.experience_years || null,
              hasNote: item.note !== null && item.note !== "",
              emailSent: item.emailSent || false,
            };
          });
        } else if (
          applicationsResponse.data &&
          typeof applicationsResponse.data === "object"
        ) {
          // If the API returns an object with applications array
          const dataObj = applicationsResponse.data as Record<string, unknown>;
          if (Array.isArray(dataObj.applications)) {
            applicationsData = dataObj.applications as ApplicationWithCV[];
          }
        }

        setApplications(applicationsData);
      }
    } catch (err) {
      console.error("Error fetching job data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch job data");
    } finally {
      setLoading(false);
    }
  };

  const viewApplicationDetail = (applicationId: string) => {
    router.push(`/admin/jobs/${jobId}/applications/${applicationId}`);
  };

  const filteredApplications = applications.filter((app) =>
    app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "new":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "new":
        return "Not Evaluated";
      default:
        return status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Job</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-yellow-800 font-medium mb-2">Job Not Found</h3>
          <p className="text-yellow-600">
            The requested job could not be found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {/* Back button and title */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Management
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
            <p className="text-gray-500">
              {job.location?.name} •{" "}
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)} •
              Posted: {formatDate(job.createdAt)}
              {job.expireDate && ` • Expires: ${formatDate(job.expireDate)}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                job.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : job.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : job.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "applications"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Applications ({applications.length})
          </button>
        </nav>
      </div>

      {/* Job Details Tab */}
      {activeTab === "details" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Job Description
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-5">
                  {job.keyResponsibility && (
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Key Responsibilities
                      </h3>
                      <p className="whitespace-pre-line text-gray-600">
                        {job.keyResponsibility}
                      </p>
                    </div>
                  )}

                  {job.mustHave && (
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        Must Have
                      </h3>
                      <p className="whitespace-pre-line text-gray-600">
                        {job.mustHave}
                      </p>
                    </div>
                  )}

                  {job.niceToHave && (
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                        Nice to Have
                      </h3>
                      <p className="whitespace-pre-line text-gray-600">
                        {job.niceToHave}
                      </p>
                    </div>
                  )}

                  {job.languageSkills && (
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                        Language Skills
                      </h3>
                      <p className="whitespace-pre-line text-gray-600">
                        {job.languageSkills}
                      </p>
                    </div>
                  )}

                  {job.ourOffer && (
                    <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-medium text-gray-700 border-b border-gray-100 pb-2 mb-3 flex items-center">
                        <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                        Our Offer
                      </h3>
                      <p className="whitespace-pre-line text-gray-600">
                        {job.ourOffer}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2">
                    Job Details
                  </h2>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Status:</dt>
                      <dd className="font-medium">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            job.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : job.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : job.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Location:</dt>
                      <dd className="font-medium">{job.location?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Posted:</dt>
                      <dd className="font-medium">
                        {formatDate(job.createdAt)}
                      </dd>
                    </div>
                    {job.expireDate && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Expires:</dt>
                        <dd className="font-medium">
                          {formatDate(job.expireDate)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Applications:</dt>
                      <dd className="font-medium">{applications.length}</dd>
                    </div>
                  </dl>
                </div>

                {job.creator && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-medium mb-3 text-gray-800 border-b border-gray-200 pb-2">
                      Posted By
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {job.creator.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{job.creator.name}</p>
                        <p className="text-gray-500 text-sm">
                          {job.creator.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applicants..."
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main content with applications table and status chart */}
          <div className="flex gap-6">
            {/* Applications table - left side */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl border shadow-sm bg-white">
                <div className="grid grid-cols-12 gap-2 border-b bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                  <div className="col-span-2">Candidate</div>
                  <div className="col-span-2">Programming</div>
                  <div className="col-span-2">Technical Skills</div>
                  <div className="col-span-1">Exp (Years)</div>
                  <div className="col-span-1">University</div>
                  <div className="col-span-1">GPA</div>
                  <div className="col-span-1">Languages</div>
                  <div className="col-span-1">Applied At</div>
                  <div className="col-span-1">Status</div>
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchQuery
                      ? "No applications found matching your search."
                      : "No applications for this job posting yet."}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className="grid grid-cols-12 gap-2 px-4 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        onClick={() => viewApplicationDetail(application.id)}
                      >
                        <div className="col-span-2 flex items-start gap-4">
                          <MatchScoreCircle
                            score={application.matchScore || 0}
                            scores={
                              application.roleScore !== undefined
                                ? {
                                    roleScore: application.roleScore,
                                    expScore: application.expScore || 0,
                                    programmingScore:
                                      application.programmingScore || 0,
                                    technicalScore:
                                      application.technicalScore || 0,
                                    softScore: application.softScore || 0,
                                    langsScore: application.langsScore || 0,
                                    keyScore: application.keyScore || 0,
                                    certScore: application.certScore || 0,
                                  }
                                : undefined
                            }
                          />

                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {application.applicant.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {application.applicant.email}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex flex-wrap max-w-[210px] gap-1">
                            {application.skills &&
                            application.skills.length > 0 ? (
                              <>
                                {application.skills
                                  .slice(0, 5)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No data
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex flex-wrap max-w-[210px] gap-1">
                            {application.technical_skills &&
                            application.technical_skills.length > 0 ? (
                              <>
                                {application.technical_skills
                                  .slice(0, 5)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No data
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-1 text-sm text-gray-700">
                          {application.experience_years !== null ? (
                            `${application.experience_years} yrs`
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </div>

                        <div className="col-span-1 text-gray-700 text-sm">
                          {(application.education &&
                            application.education[0]?.university) || (
                            <span className="text-gray-400">No data</span>
                          )}
                        </div>

                        <div className="col-span-1 text-gray-700 text-sm">
                          {(application.education &&
                            application.education[0]?.gpa) || (
                            <span className="text-gray-400">No data</span>
                          )}
                        </div>

                        <div className="col-span-1 text-gray-700">
                          <div className="flex flex-col gap-1">
                            {application.languages &&
                            application.languages.length > 0 ? (
                              application.languages.map((lang, index) => (
                                <span key={index} className="text-xs">
                                  {lang.language}:{" "}
                                  <span className="font-medium">
                                    {lang.level}
                                  </span>
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">
                                No data
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-1 text-gray-700 text-sm">
                          {formatDate(application.createdAt || "")}
                        </div>

                        <div className="col-span-1">
                          <div className="space-y-2">
                            {/* Status badge */}
                            <div className="flex">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                                  application.status
                                )}`}
                              >
                                {getStatusDisplay(application.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status chart - right side */}
            <div className="w-72 flex-shrink-0">
              <ApplicationStatusChart applications={applications} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
