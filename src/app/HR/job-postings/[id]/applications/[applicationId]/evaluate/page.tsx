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
import { apiCall, getJobDetail, getApplicationsByApplicantId, checkApplicantJobEmail } from "@/lib/api";
import type { ApplicationHistory } from "@/components/candidates/useCandidates";

export default function ApplicationEvaluationPage() {
  const [application, setApplication] = useState<ApplicationApiResponse | null>(
    null
  );
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
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
    // Don't allow submission if job is closed
    if (jobDetails?.status === "closed") {
      toast.error("Cannot evaluate application - job is closed");
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
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
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
                            onClick={() => setIsEmailModalOpen(true)}
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
                    disabled={isJobClosed}
                    disabledReason={isJobClosed ? 'job-closed' : 'email-sent'}
                    noteOnlyMode={isEmailSent && !isJobClosed}
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
    </div>
  );
}
