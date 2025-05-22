"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ArrowLeft, Loader2, Tag, X, Mail } from "lucide-react";
import { getApplicationsByJobId, Application } from "@/lib/api";
import MatchScoreCircle from "@/components/MatchScoreCircle";
import BulkEmailNotificationModal from "@/components/BulkEmailNotificationModal";

// Interface for the API response from backend
interface ApplicationApiResponse {
  id: string;
  applicantId: string;
  jobId: string;
  cvFileUrl: string;
  submittedAt: string;
  matchingScore: number | null;
  roleScore: number | null;
  expScore: number | null;
  programmingScore: number | null;
  technicalScore: number | null;
  softScore: number | null;
  langsScore: number | null;
  keyScore: number | null;
  certScore: number | null;
  missingFeedback: string | null;
  note: string | null;
  result: boolean | null;
  applicant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  job?: {
    id: string;
    jobTitle: string;
  };
  skills?: string[];
  technical_skills?: string[];
  languages?: Array<{
    language: string;
    level: string;
  }>;
  education?: Array<{
    major: string;
    university: string;
    gpa: string;
    degree: string;
    graduation_year: string;
  }>;
  hasStructuredData?: boolean;
  latest_company?: string | null;
  experience_years?: number | null;
}

// Extended Application interface to include cvFileUrl and detailed scores
interface ApplicationWithCV extends Application {
  cvFileUrl?: string;
  missingFeedback?: string | null;
  matchingScore?: number | null;
  roleScore?: number;
  expScore?: number;
  programmingScore?: number;
  technicalScore?: number;
  softScore?: number;
  langsScore?: number;
  keyScore?: number;
  certScore?: number;
  skills?: string[];
  technical_skills?: string[];
  languages?: Array<{
    language: string;
    level: string;
  }>;
  education?: Array<{
    major: string;
    university: string;
    gpa: string;
    degree: string;
    graduation_year: string;
  }>;
  hasStructuredData?: boolean;
  latest_company?: string | null;
  experience_years?: number | null;
  hasNote?: boolean;
  emailSent?: boolean;
}

// Feedback modal component
function FeedbackModal({
  isOpen,
  onClose,
  feedback,
}: {
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Missing Requirements</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <p className="whitespace-pre-wrap text-gray-700">{feedback}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplicationsByJobId(jobId);

      if (response.error) {
        setError(response.error);
      } else {
        // Correctly handle the response data type
        let applicationsData: ApplicationWithCV[] = [];

        if (Array.isArray(response.data)) {
          // Extract the backend response and convert to our Application type
          const apiResponse =
            response.data as unknown as ApplicationApiResponse[];

          // Map the API response to our Application interface
          applicationsData = apiResponse.map((item) => {
            // Map result (boolean | null) to status string
            let status: Application["status"];
            if (item.result === true) {
              status = "hired";
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
              emailSent: false,
            };
          });

          // If we have applications and job title is not known yet
          if (applicationsData.length > 0 && !jobTitle) {
            setJobTitle(applicationsData[0].job.jobTitle);
          }
        } else if (response.data && typeof response.data === "object") {
          // If the API returns an object with applications array
          const dataObj = response.data as Record<string, unknown>;
          if (Array.isArray(dataObj.applications)) {
            applicationsData = dataObj.applications as ApplicationWithCV[];
          }
        }

        setApplications(applicationsData);
      }
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewJobKeywords = () => {
    router.push(`/HR/job-postings/${jobId}/keywords`);
  };

  const openFeedbackModal = (feedback: string) => {
    setCurrentFeedback(feedback);
    setModalOpen(true);
  };

  const openBulkEmailModal = (status: string) => {
    const applicationsWithStatus = applications.filter(app => 
      (status === "hired" && app.status === "hired" && !app.emailSent) ||
      (status === "rejected" && app.status === "rejected" && !app.emailSent)
    );
    
    if (applicationsWithStatus.length === 0) {
      setError(`No ${status === "hired" ? "accepted" : "rejected"} applications without email notifications.`);
      return;
    }
    
    setSelectedApplicationIds(applicationsWithStatus.map(app => app.id));
    setSelectedStatus(status === "hired" ? "Accepted" : "Rejected");
    setIsBulkEmailModalOpen(true);
  };

  const filteredApplications = applications.filter((app) =>
    app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "hired":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "new":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "hired":
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Postings
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-gray-500">
            {jobTitle
              ? `Applications for ${jobTitle}`
              : "View all applications for this job position"}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => openBulkEmailModal("hired")}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            disabled={loading}
          >
            <Mail className="h-4 w-4" />
            Email Accepted
          </button>
          <button
            onClick={() => openBulkEmailModal("rejected")}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            disabled={loading}
          >
            <Mail className="h-4 w-4" />
            Email Rejected
          </button>
          <button
            onClick={viewJobKeywords}
            className="flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            <Tag className="h-4 w-4" />
            View JD & Keywords
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-1/3">
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
        {/* <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filters
        </button> */}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      )}

      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-11 gap-2 border-b bg-gray-50 px-3 py-3 text-sm font-medium text-gray-600">
          <div className="col-span-2">Candidate</div>
          <div className="col-span-2">Programming</div>
          <div className="col-span-2">Technical Skills</div>
          <div className="col-span-1">Exp (Years)</div>
          <div className="col-span-1">University</div>
          <div className="col-span-1">GPA</div>
          <div className="col-span-1">Languages</div>
          <div className="col-span-1">Status</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredApplications.length === 0 ? (
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
                className="grid grid-cols-11 gap-2 px-3 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/HR/job-postings/${jobId}/applications/${application.id}/evaluate`
                  )
                }
              >
                <div className="col-span-2 flex items-start gap-4">
                  <MatchScoreCircle
                    score={application.matchScore || 0}
                    scores={
                      application.roleScore !== undefined
                        ? {
                            roleScore: application.roleScore,
                            expScore: application.expScore || 0,
                            programmingScore: application.programmingScore || 0,
                            technicalScore: application.technicalScore || 0,
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
                    {application.skills && application.skills.length > 0 ? (
                      application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No data</span>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-wrap max-w-[210px] gap-1">
                    {application.technical_skills &&
                    application.technical_skills.length > 0 ? (
                      application.technical_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No data</span>
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
                  {(application.education && application.education[0]?.gpa) || (
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
                          <span className="font-medium">{lang.level}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No data</span>
                    )}
                  </div>
                </div>

                <div className="col-span-1 flex items-start">
                  <div className="flex flex-col items-start gap-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        application.status
                      )}`}
                    >
                      {getStatusDisplay(application.status)}
                    </span>

                    {application.hasNote && (
                      <span className="flex items-center gap-1 text-xs text-blue-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        Has note
                      </span>
                    )}
                    {application.missingFeedback && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFeedbackModal(application.missingFeedback || "");
                        }}
                        className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                        title="View missing requirements"
                      >
                        <span>View Feedback</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        feedback={currentFeedback}
      />

      {isBulkEmailModalOpen && (
        <BulkEmailNotificationModal
          isOpen={isBulkEmailModalOpen}
          onClose={() => {
            setIsBulkEmailModalOpen(false);
            fetchApplications(); // Refresh to update email sent status
          }}
          applicationIds={selectedApplicationIds}
          statusText={selectedStatus}
        />
      )}
    </div>
  );
}
