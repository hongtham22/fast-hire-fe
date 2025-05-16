"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CVViewer } from "@/components/CVViewer";
import { ApplicationEvaluationForm } from "@/components/ApplicationEvaluationForm";
import { MissingRequirementsCard } from "@/components/MissingRequirementsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Application } from "@/types/api";
import MatchScoreChartInline from "@/components/matchScoreChartInline";

export default function ApplicationEvaluationPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id: jobId, applicationId } = params;

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${jobId}/applications/${applicationId}`
      );
      if (!response.ok) throw new Error("Failed to fetch application");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/${jobId}/applications/${applicationId}/evaluate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to save evaluation");

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
                </div>
                <div className="w-1/2">
                  <MatchScoreChartInline
                    roleScore={application.roleScore || 0}
                    expScore={application.expScore || 0}
                    programmingScore={application.programmingScore || 0}
                    technicalScore={application.technicalScore || 0}
                    softScore={application.softScore || 0}
                    langsScore={application.langsScore || 0}
                    keyScore={application.keyScore || 0}
                    certScore={application.certScore || 0}
                    totalScore={application.matchingScore || 0}
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
    </div>
  );
}
