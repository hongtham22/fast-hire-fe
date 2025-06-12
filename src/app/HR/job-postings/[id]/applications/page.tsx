"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, ArrowLeft, Loader2, Tag, X, Mail, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getApplicationsByJobId } from "@/lib/api";
import { Application, ApplicationApiResponse, ApplicationWithCV } from "@/types/application";
import MatchScoreCircle from "@/components/MatchScoreCircle";
import BulkEmailNotificationModal from "@/components/BulkEmailNotificationModal";
import ConflictWarningModal from "@/components/ConflictWarningModal";
import ApplicationStatusChart from "@/components/ApplicationStatusChart";
import { formatDate } from "@/lib/utils";

// Types for conflict detection
interface ConflictData {
  applicantId: string;
  applicantName: string;
  applications: Application[];
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
  const [sortBy, setSortBy] = useState<"none" | "score_asc" | "score_desc">("none");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [topMatchScore, setTopMatchScore] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Conflict detection states
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{
    conflicts: ConflictData[];
    selectedStatus: string;
    selectedApps: ApplicationWithCV[];
  } | null>(null);

  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    if (applications.length > 0) {
      // Find the highest matching score
      const highestScore = Math.max(
        ...applications
          .filter(app => app.matchScore !== undefined)
          .map(app => app.matchScore || 0)
      );
      setTopMatchScore(highestScore > 0 ? highestScore : null);
    } else {
      setTopMatchScore(null);
    }
  }, [applications]);

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

  // Conflict detection function
  const detectConflicts = (selectedApps: ApplicationWithCV[], allApps: ApplicationWithCV[]): ConflictData[] => {
    const conflicts: ConflictData[] = [];
    const selectedApplicantIds = new Set(selectedApps.map(app => app.applicant.id));
    
    for (const applicantId of Array.from(selectedApplicantIds)) {
      const applicantApps = allApps.filter(app => app.applicant.id === applicantId);
      const statuses = new Set(applicantApps.map(app => app.status));
      
      // Check if this applicant has applications with different statuses
      if (statuses.size > 1) {
        conflicts.push({
          applicantId,
          applicantName: applicantApps[0].applicant.name,
          applications: applicantApps.map(app => ({
            id: app.id,
            applicant: app.applicant,
            job: app.job,
            status: app.status,
            createdAt: app.createdAt,
            submittedAt: app.createdAt,
            note: app.hasNote ? "Has evaluation note" : undefined,
            emailSent: app.emailSent
          } as Application))
        });
      }
    }
    
    return conflicts;
  };

  // Updated openBulkEmailModal with conflict detection
  const openBulkEmailModal = (status: string) => {
    const applicationsWithStatus = applications.filter(app => 
      (status === "accepted" && app.status === "accepted" && !app.emailSent) ||
      (status === "rejected" && app.status === "rejected" && !app.emailSent)
    );
    
    if (applicationsWithStatus.length === 0) {
      setError(`All ${status === "accepted" ? "accepted" : "rejected"} applications have already been notified via email.`);
      return;
    }

    // Detect conflicts
    const conflicts = detectConflicts(applicationsWithStatus, applications);
    
    if (conflicts.length > 0) {
      // Show conflict warning modal
      setConflictData({
        conflicts,
        selectedStatus: status,
        selectedApps: applicationsWithStatus
      });
      setShowConflictModal(true);
    } else {
      // No conflicts, proceed normally
      setSelectedApplicationIds(applicationsWithStatus.map(app => app.id));
      setSelectedStatus(status === "accepted" ? "Accepted" : "Rejected");
      setIsBulkEmailModalOpen(true);
    }
  };

  // Handle continue from conflict modal
  const handleConflictContinue = () => {
    if (conflictData) {
      setSelectedApplicationIds(conflictData.selectedApps.map(app => app.id));
      setSelectedStatus(conflictData.selectedStatus === "accepted" ? "Accepted" : "Rejected");
      setShowConflictModal(false);
      setConflictData(null);
      setIsBulkEmailModalOpen(true);
    }
  };

  // Handle cancel from conflict modal
  const handleConflictCancel = () => {
    setShowConflictModal(false);
    setConflictData(null);
  };

  const filteredApplications = applications
    .filter((app) => app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score_desc") {
        return (b.matchScore || 0) - (a.matchScore || 0);
      } else if (sortBy === "score_asc") {
        return (a.matchScore || 0) - (b.matchScore || 0);
      }
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search query or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

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


  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPageButtons = 5; // Maximum number of page buttons to show
      
      if (totalPages <= maxPageButtons) {
        // Show all pages if there are few pages
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show a range of pages
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = startPage + maxPageButtons - 1;
        
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      }
      
      return pageNumbers;
    };

    return (
      <div className="mt-4 flex items-center justify-between px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {paginatedApplications.length} of {filteredApplications.length} applications
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className={`rounded-md border border-gray-300 p-1 ${
              currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={loading}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className={`rounded-md border border-gray-300 p-1 ${
              currentPage === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
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
            onClick={() => openBulkEmailModal("accepted")}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            disabled={loading}
          >
            <Mail className="h-4 w-4" />
            Email Accepted
          </button>
          <button
            onClick={() => openBulkEmailModal("rejected")}
            className="flex items-center gap-2 rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
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
        
        {/* Sort dropdown */}
        <div className="relative z-50">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <span>
              {sortBy === "none"
                ? "Sort by"
                : sortBy === "score_desc"
                ? "Highest Score First"
                : "Lowest Score First"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sortBy === "none" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSortBy("none");
                  setShowSortDropdown(false);
                }}
              >
                No Sort
              </button>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sortBy === "score_desc" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSortBy("score_desc");
                  setShowSortDropdown(false);
                }}
              >
                Highest Score First
              </button>
              <button
                className={`block w-full px-4 py-2 text-left text-sm ${
                  sortBy === "score_asc" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSortBy("score_asc");
                  setShowSortDropdown(false);
                }}
              >
                Lowest Score First
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* Main content with applications table and status chart */}
      <div className="flex gap-4">
        {/* Applications table - left side */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border shadow-sm">
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : paginatedApplications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchQuery
                  ? "No applications found matching your search."
                  : "No applications for this job posting yet."}
              </div>
            ) : (
              <div>
                <div className="divide-y">
                  {paginatedApplications.map((application) => (
                    <div
                      key={application.id}
                      className="grid grid-cols-12 gap-2 px-4 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() =>
                        router.push(
                          `/HR/job-postings/${jobId}/applications/${application.id}/evaluate`
                        )
                      }
                    >
                      <div className="col-span-2 flex items-start gap-4">
                        <div className="relative">
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
                          {topMatchScore !== null && 
                           application.matchScore === topMatchScore && 
                           topMatchScore > 0 && (
                            <div className="absolute top-0 left-0 transform -translate-y-1/2 -translate-x-1/2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                                ★
                              </div>
                            </div>
                          )}
                        </div>

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
                                className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
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

                          {/* Additional indicators */}
                          <div className="space-y-1">

                            {application.missingFeedback && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openFeedbackModal(application.missingFeedback || "");
                                }}
                                className="text-left rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-black-600 hover:bg-gray-200 transition-colors"
                                title="View missing requirements"
                              >
                              View Feedback
                              </button>
                            )}
                            
                            {application.hasNote && (
                              <div className="flex items-center gap-1 text-xs text-blue-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                                <span>Has note</span>
                              </div>
                            )}

                            {/* Email notification flag */}
                            {(
                              <div 
                                className={`flex items-center gap-1 text-xs ${
                                  application.emailSent ? "text-blue-600" : "text-gray-500"
                                }`}
                                title={application.emailSent ? "Email notification sent" : "No email notification sent yet"}
                              >
                                <Mail className="h-3 w-3" />
                                <span>{application.emailSent ? "Email sent" : "No email"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {renderPagination()}
              </div>
            )}
          </div>
        </div>

        {/* Status chart - right side */}
        <div className="w-64 flex-shrink-0">
          <ApplicationStatusChart applications={applications} />
        </div>
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
          preferredTemplateName={
            selectedStatus === "accepted" 
              ? "Application Accepted" 
              : selectedStatus === "rejected" 
              ? "Application Rejected" 
              : undefined
          }
        />
      )}

      {showConflictModal && conflictData && (
        <ConflictWarningModal
          isOpen={showConflictModal}
          onClose={handleConflictCancel}
          onContinue={handleConflictContinue}
          conflicts={conflictData.conflicts}
          selectedStatus={conflictData.selectedStatus}
          selectedCount={conflictData.selectedApps.length}
        />
      )}
    </div>
  );
}
