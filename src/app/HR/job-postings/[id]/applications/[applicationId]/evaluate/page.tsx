"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, History } from "lucide-react";
import { CVViewer } from "@/components/CVViewer";
import { ApplicationEvaluationForm } from "@/components/ApplicationEvaluationForm";
import { MissingRequirementsCard } from "@/components/MissingRequirementsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ApplicationApiResponse } from "@/types/application";
import { JobDetail } from "@/types/job";
import MatchScoreChartInline from "@/components/matchScoreChartInline";
import { IoArrowForwardOutline } from "react-icons/io5";
import Link from "next/link";
import EmailNotificationModal from "@/components/EmailNotificationModal";
import ApplicationHistoryModal from "@/components/candidates/ApplicationHistoryModal";
import SentEmailModal from "@/components/SentEmailModal";
import { apiCall, getJobDetail, getApplicationsByApplicantId, checkApplicantJobEmail } from "@/lib/api";
import type { ApplicationHistory } from "@/components/candidates/useCandidates";
import { formatDate } from "@/lib/utils";
import { IoClose, IoWarning } from "react-icons/io5";

// Detailed Email Conflict Modal Component
function EmailConflictModal({
  isOpen,
  onContinue,
  onCancel,
  message,
  application,
  conflictApplications,
}: {
  isOpen: boolean;
  onContinue: () => void;
  onCancel: () => void;
  message: string;
  application: ApplicationApiResponse | null;
  conflictApplications?: ApplicationHistory[];
}) {
  if (!isOpen || !application) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ❌ Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            📝 Not Evaluated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const currentStatus = application.result === true ? 'accepted' : 
                       application.result === false ? 'rejected' : 'pending';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <IoWarning className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conflict Warning</h2>
                <p className="text-sm text-gray-600">
                  Multiple applications detected for this candidate
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <IoWarning className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Conflicting Applications Detected
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>{message}</p>
                  <p className="mt-1">
                    <strong>This may cause confusion for the applicant.</strong> Please review carefully before continuing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Information */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Candidate: {application.applicant.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 text-gray-900">{application.applicant.email}</span>
              </div>
              {application.applicant.phone && (
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-900">{application.applicant.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Application Details */}
          {conflictApplications && conflictApplications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                All Applications for this Position:
              </h3>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">
                    {application.applicant.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {conflictApplications.length} applications
                  </span>
                </div>
                
                <div className="space-y-2">
                  {conflictApplications
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map((app, index) => (
                      <div 
                        key={app.id} 
                        className={`flex items-center justify-between p-3 rounded-md ${
                          app.id === application.id 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            #{index + 1}
                            {app.id === application.id && (
                              <span className="ml-2 text-blue-600 font-bold">(Current)</span>
                            )}
                          </span>
                          <span className="text-sm text-gray-600">
                            Applied: {formatDate(app.submittedAt)}
                          </span>
                          {getStatusBadge(app.status)}
                        </div>
                        
                        {app.matchingScore && (
                          <div className="text-sm text-gray-600">
                            Score: {Math.round(app.matchingScore)}%
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                
                {/* Show what will happen */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-sm">
                    <span className="font-medium text-blue-800">Impact: </span>
                    <span className="text-blue-700">
                      Will receive {currentStatus.toUpperCase()} email
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Will send <strong>{currentStatus.toUpperCase()}</strong> email to <strong>{application.applicant.name}</strong></li>
              <li>• Position: <strong>{application.job?.jobTitle || 'Unknown Position'}</strong></li>
              <li>• Candidate has <strong>{conflictApplications?.length || 1}</strong> applications with different results</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel - Review First
            </button>
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-medium"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationEvaluationPage() {
  const [application, setApplication] = useState<ApplicationApiResponse | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSentEmailModalOpen, setIsSentEmailModalOpen] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string>("");
  const [conflictApplications, setConflictApplications] = useState<ApplicationHistory[]>([]);
  const params = useParams();
  const router = useRouter();
  const { id: jobId, applicationId } = params;

  useEffect(() => {
    fetchApplicationAndJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  // Check for existing emails when application is loaded
  useEffect(() => {
    const checkExistingEmails = async () => {
      if (!application) return;
      
      try {
        const { data, error } = await checkApplicantJobEmail(
          application.applicantId,
          application.jobId
        );
        
        if (error) {
          console.error('Error checking existing emails:', error);
          return;
        }
        
        if (data?.hasReceived) {
          const sentDate = data.sentAt ? new Date(data.sentAt).toLocaleDateString() : 'Unknown date';
          setEmailWarning(
            `${application.applicant.name} already received a ${data.emailType} email for this position on ${sentDate}. No additional result emails can be sent.`
          );
        } else {
          setEmailWarning(null);
        }
      } catch (error) {
        console.error('Error checking existing emails:', error);
      }
    };

    checkExistingEmails();
  }, [application]);

  const fetchApplicationAndJob = async () => {
    try {
      // Fetch both application and job details in parallel
      const [applicationResponse, jobResponse] = await Promise.all([
        apiCall(`/applications/${jobId}/applications/${applicationId}`),
        getJobDetail(jobId as string),
      ]);

      if (!applicationResponse || !applicationResponse.ok) {
        throw new Error("Failed to fetch application");
      }

      const applicationData = await applicationResponse.json();
      setApplication(applicationData);

      if (jobResponse.error) {
        console.error("Failed to fetch job details:", jobResponse.error);
        // Continue without job details if fetch fails
      } else if (jobResponse.data) {
        setJobDetails(jobResponse.data);
      }
    } catch (error) {
      toast.error("Failed to load application details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplication = async () => {
    try {
      const response = await apiCall(
        `/applications/${jobId}/applications/${applicationId}`
      );
      if (!response || !response.ok)
        throw new Error("Failed to fetch application");
      const data = await response.json();
      setApplication(data);
    } catch (error) {
      toast.error("Failed to load application details");
      console.error(error);
    }
  };

  const fetchApplicationHistory = async (
    candidateId: string
  ): Promise<ApplicationHistory[]> => {
    try {
      const response = await getApplicationsByApplicantId(candidateId);
      if (response.error) {
        throw new Error(response.error);
      }

      return (response.data || []).map((app) => ({
        id: app.id,
        job: {
          id: app.jobId,
          jobTitle: app.job?.jobTitle || "Unknown Position",
        },
        submittedAt: app.submittedAt,
        matchingScore: app.matchingScore,
        result: app.result,
        status:
          app.result === true
            ? ("accepted" as const)
            : app.result === false
            ? ("rejected" as const)
            : ("pending" as const),
      }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch application history");
      }
      throw error;
    }
  };

  const handleEvaluationSubmit = async (data: {
    note?: string;
    result: boolean | null;
  }) => {

    if (application?.emailSent) {
      toast.error("Cannot evaluate application - email notification has already been sent");
      return;
    }

    setSaving(true);
    try {
      const response = await apiCall(
        `/applications/${jobId}/applications/${applicationId}/evaluate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response || !response.ok)
        throw new Error("Failed to save evaluation");

      toast.success("Evaluation saved successfully");
      // Only fetch if we're submitting a result to avoid unnecessary refreshes
      if (data.result !== undefined) {
        await fetchApplication();
      }
    } catch (error) {
      toast.error("Failed to save evaluation");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const isJobClosed = jobDetails?.status === "closed";
  const isEmailSent = application?.emailSent;
  const hasEvaluationResult = application?.result !== null && application?.result !== undefined;

  const handleSendEmailClick = async () => {
    if (!application) return;

    try {
      // 1. Check email-level conflicts (already sent emails)
      const { data: emailData, error: emailError } = await checkApplicantJobEmail(
        application.applicantId,
        application.jobId
      );
      
      if (emailError) {
        console.error('Error checking existing emails:', emailError);
        // Continue with email modal if check fails
        setIsEmailModalOpen(true);
        return;
      }

      // 2. Check application-level conflicts (multiple applications with different results)
      const { data: applicantApps, error: appsError } = await getApplicationsByApplicantId(application.applicantId);
      
      if (appsError) {
        console.error('Error checking applicant applications:', appsError);
        // Continue with email modal if check fails
        setIsEmailModalOpen(true);
        return;
      }

      // Filter applications for the same job
      const sameJobApps = (applicantApps || []).filter(app => app.jobId === application.jobId);
      
      // Check if there are multiple applications with different results
      const hasConflictingResults = sameJobApps.length > 1 && 
        new Set(sameJobApps.map(app => 
          app.result === true ? 'accepted' : 
          app.result === false ? 'rejected' : 'pending'
        )).size > 1;

      // 3. Determine conflict message
      let conflictMessage = '';
      
      if (emailData?.hasReceived) {
        // Email-level conflict
        const sentDate = emailData.sentAt ? new Date(emailData.sentAt).toLocaleDateString() : 'Unknown date';
        conflictMessage = `${application.applicant.name} already received a ${emailData.emailType} email for this position on ${sentDate}. Sending another email may confuse the candidate. Do you want to continue?`;
      } else if (hasConflictingResults) {
        // Application-level conflict
        const currentStatus = application.result === true ? 'accepted' : 
                            application.result === false ? 'rejected' : 'pending';
        const otherStatuses = sameJobApps
          .filter(app => app.id !== application.id)
          .map(app => app.result === true ? 'accepted' : 
                     app.result === false ? 'rejected' : 'pending')
          .filter((status, index, arr) => arr.indexOf(status) === index); // unique statuses
        
        conflictMessage = `${application.applicant.name} has multiple applications for this position with different results (${[currentStatus, ...otherStatuses].join(', ')}). Sending a ${currentStatus} email may confuse the candidate. Do you want to continue?`;
      }

      // 4. Show modal or continue
      if (conflictMessage) {
        // Fetch detailed application history for the modal
        try {
          const detailedHistory = await fetchApplicationHistory(application.applicantId);
          const sameJobHistory = detailedHistory.filter(app => app.job.id === application.jobId);
          setConflictApplications(sameJobHistory);
        } catch (error) {
          console.error('Error fetching application history:', error);
          setConflictApplications([]);
        }
        
        setConflictMessage(conflictMessage);
        setShowConflictModal(true);
      } else {
        // No conflict, open email modal directly
        setIsEmailModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
      // Continue with email modal if check fails
      setIsEmailModalOpen(true);
    }
  };

  const handleConflictContinue = () => {
    setShowConflictModal(false);
    setIsEmailModalOpen(true);
  };

  const handleConflictCancel = () => {
    setShowConflictModal(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Application not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </button>
          {isJobClosed && (
            <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Job Closed
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white">
        {/* Email Warning */}
        {emailWarning && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
               onClick={() => setIsSentEmailModalOpen(true)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Email Already Sent
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {emailWarning}
                  </p>
                </div>
              </div>
              <div className="text-sm text-yellow-600 font-medium">
                Click to view details →
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-row gap-6">
          {/* Left Column - CV Viewer */}
          <div className="w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>CV Document</CardTitle>
              </CardHeader>
              <CardContent>
                <CVViewer cvFileUrl={application.cvFileUrl} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Evaluation */}
          <div className="w-1/2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                      <div>
                        <h3 className="font-medium">Candidate</h3>
                        <p className="text-gray-600">
                          {application.applicant.name}
                        </p>
                        <p className="text-gray-600">
                          {application.applicant.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Position</h3>
                        <p className="text-gray-600">
                          {application.job?.jobTitle || "Unknown Position"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Applied On</h3>
                        <p className="text-gray-600">
                          {formatDate(application.submittedAt)}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/HR/applications/cv-viewer/${application.id}`}
                        >
                          <button
                            type="button"
                            className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[200px] xl:py-[10px] xl:pr-[45px] bg-white group mb-2"
                          >
                            <div className="absolute right-0 h-[300px] w-[400px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>
                            <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold">
                              View keywords
                            </span>
                            <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 transform">
                              <div className="relative flex items-center justify-center">
                                <div className="h-10 w-10 rounded-full transition-all duration-500 ease-in-out bg-orange-dark flex items-center justify-center group-hover:bg-white">
                                  <IoArrowForwardOutline className="h-5 w-5 text-white group-hover:text-orange-dark transition-colors duration-500" />
                                </div>
                              </div>
                            </div>
                          </button>
                        </Link>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsHistoryModalOpen(true)}
                          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-orange-dark border border-orange-dark hover:bg-orange-dark hover:text-white transition-colors duration-200"
                        >
                          <History className="h-4 w-4" />
                          View History
                        </button>

                        {hasEvaluationResult && !application.emailSent && (
                          <button
                            type="button"
                            onClick={handleSendEmailClick}
                            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-800 border border-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors duration-200"
                            disabled={application.emailSent}
                            title={
                              !hasEvaluationResult
                                ? "Please complete evaluation first"
                                : application.emailSent
                                ? "Notification email already sent"
                                : "Send email notification"
                            }
                          >
                            <Mail className="h-4 w-4" />
                            Send Email
                          </button>
                        )}

                        {application.emailSent && (
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 cursor-not-allowed"
                            disabled={true}
                          >
                            <Mail className="h-4 w-4" />
                            Email Sent
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-1/2">
                      <MatchScoreChartInline
                        roleScore={Number(application?.roleScore ?? 0)}
                        expScore={Number(application?.expScore ?? 0)}
                        programmingScore={Number(
                          application?.programmingScore ?? 0
                        )}
                        technicalScore={Number(
                          application?.technicalScore ?? 0
                        )}
                        softScore={Number(application?.softScore ?? 0)}
                        langsScore={Number(application?.langsScore ?? 0)}
                        keyScore={Number(application?.keyScore ?? 0)}
                        certScore={Number(application?.certScore ?? 0)}
                        totalScore={Number(application?.matchingScore ?? 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {application.missingFeedback && (
                <MissingRequirementsCard
                  feedback={application.missingFeedback}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Evaluation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationEvaluationForm
                    initialNote={application.note || ""}
                    initialResult={application.result}
                    onSubmit={handleEvaluationSubmit}
                    isLoading={saving}
                    disabled={false}
                    disabledReason='email-sent'
                    noteOnlyMode={isEmailSent}
                    onEmailAlreadySentClick={() => setIsSentEmailModalOpen(true)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EmailNotificationModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          fetchApplication(); // Refresh to update email sent status
        }}
        applicationId={applicationId as string}
        preferredTemplateName={
          application?.result === true 
            ? "Application Accepted" 
            : application?.result === false 
            ? "Application Rejected" 
            : undefined
        }
      />

      <ApplicationHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        candidate={
          application?.applicant
            ? {
                id: application.applicant.id,
                name: application.applicant.name,
                email: application.applicant.email,
              }
            : null
        }
        fetchApplicationHistory={fetchApplicationHistory}
        onError={(errorMessage) => toast.error(errorMessage)}
      />

      <SentEmailModal
        isOpen={isSentEmailModalOpen}
        onClose={() => setIsSentEmailModalOpen(false)}
        applicationId={applicationId as string}
        applicantId={application?.applicant?.id || ""}
        jobId={jobId as string}
        applicantName={application?.applicant?.name || ""}
      />

      <EmailConflictModal
        isOpen={showConflictModal}
        onContinue={handleConflictContinue}
        onCancel={handleConflictCancel}
        message={conflictMessage}
        application={application}
        conflictApplications={conflictApplications}
      />
    </div>
  );
}
