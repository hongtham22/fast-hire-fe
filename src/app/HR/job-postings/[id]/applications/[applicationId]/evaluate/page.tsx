"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { CVViewer } from "@/components/CVViewer";
import { ApplicationEvaluationForm } from "@/components/ApplicationEvaluationForm";
import { MissingRequirementsCard } from "@/components/MissingRequirementsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Application } from "@/types/api";
import MatchScoreChartInline from "@/components/matchScoreChartInline";
import { IoArrowForwardOutline } from 'react-icons/io5';
import Link from 'next/link';
import EmailNotificationModal from "@/components/EmailNotificationModal";
import { apiCall } from "@/lib/api";

export default function ApplicationEvaluationPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id: jobId, applicationId } = params;

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await apiCall(
        `/applications/${jobId}/applications/${applicationId}`
      );
      if (!response || !response.ok) throw new Error("Failed to fetch application");
      const data = await response.json();
      setApplication(data);
    } catch (error) {
      toast.error("Failed to load application details");
      console.error(error);
    } finally {
      setLoading(false);
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

  const handleEvaluationSubmit = async (data: {
    note?: string;
    result: boolean | null;
  }) => {
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

      if (!response || !response.ok) throw new Error("Failed to save evaluation");

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>
      </div>

      <div className="flex flex-row gap-6">
        {/* Left Column - CV Viewer */}
        <div className="w-1/2">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>CV Document</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CVViewer cvFileUrl={application.cvFileUrl} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Evaluation */}
        <div className="w-1/2 space-y-6">
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
                    <p className="text-gray-600">{application.job.jobTitle}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Applied On</h3>
                    <p className="text-gray-600">
                      {formatDate(application.submittedAt)}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/HR/applications/cv-viewer/${application.id}`}>
                      <button
                        type="button"
                        className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[210px] xl:py-[15px] xl:pr-[55px] bg-white group"
                      >
                        <div className="absolute right-0 h-[500px] w-[600px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>
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
                    
                    {application.result !== null && (
                      <button
                        type="button"
                        onClick={() => setIsEmailModalOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-white-300 px-4 py-2 text-sm font-medium text-emerald-800 border border-emerald-500"
                        disabled={application.emailSent}
                        title={application.emailSent ? "Notification email already sent" : "Send email notification"}
                      >
                        <Mail className="h-5 w-5" />
                        {application.emailSent ? "Email Sent" : "Send Email"}
                      </button>
                    )}
                  </div>
                  
                </div>
                <div className="w-1/2">
                  <MatchScoreChartInline
                    roleScore={Number(application?.roleScore ?? 0)}
                    expScore={Number(application?.expScore ?? 0)}
                    programmingScore={Number(application?.programmingScore ?? 0)}
                    technicalScore={Number(application?.technicalScore ?? 0)}
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
            <MissingRequirementsCard feedback={application.missingFeedback} />
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
              />
            </CardContent>
          </Card>
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
    </div>
  );
}
