"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CVViewer } from "@/components/CVViewer";
import { MissingRequirementsCard } from "@/components/MissingRequirementsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Application } from "@/types/api";
import { JobDetail } from "@/types/job";
import MatchScoreChartInline from "@/components/matchScoreChartInline";
import { apiCall, getJobDetail } from "@/lib/api";
import { formatDate } from "@/lib/utils";

// Mở rộng kiểu Application để bao gồm các trường bổ sung từ CV
interface ApplicationWithCVData extends Application {
  skills?: string[];
  technical_skills?: string[];
  languages?: Array<{ language: string; level: string }>;
  education?: Array<{
    university?: string;
    school?: string;
    degree?: string;
    gpa?: string;
    startDate?: string;
    endDate?: string;
  }>;
  experience_years?: number;
  latest_company?: string;
}

export default function AdminApplicationDetailPage() {
  const [application, setApplication] = useState<ApplicationWithCVData | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { jobId, applicationId } = params;

  useEffect(() => {
    fetchApplicationAndJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const fetchApplicationAndJob = async () => {
    try {
      // Fetch both application and job details in parallel
      const [applicationResponse, jobResponse] = await Promise.all([
        apiCall(`/applications/${jobId}/applications/${applicationId}`),
        getJobDetail(jobId as string)
      ]);

      if (!applicationResponse || !applicationResponse.ok) {
        throw new Error("Failed to fetch application");
      }
      
      const applicationData = await applicationResponse.json();
      setApplication(applicationData as ApplicationWithCVData);

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

  const getStatusDisplay = (status: string | null | boolean) => {
    if (status === true || status === "accepted") {
      return "Accepted";
    } else if (status === false || status === "rejected") {
      return "Rejected";
    } else {
      return "Not Evaluated";
    }
  };

  const getStatusBadgeClass = (status: string | null | boolean) => {
    if (status === true || status === "accepted") {
      return "bg-green-100 text-green-700";
    } else if (status === false || status === "rejected") {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-orange-100 text-orange-700";
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

  if (!application) {
    return (
      <div className="px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium mb-2">Application Not Found</h3>
          <p className="text-red-600">The requested application could not be found.</p>
          <button 
            onClick={() => router.push(`/admin/jobs/${jobId}`)}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Job Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/admin/jobs/${jobId}`)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </button>
        
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">Application Details</h1>
          <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(application.result)}`}>
            {getStatusDisplay(application.result)}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - CV Viewer */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>CV Document</CardTitle>
            </CardHeader>
            <CardContent>
              <CVViewer cvFileUrl={application.cvFileUrl} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="w-full lg:w-1/2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700">Candidate</h3>
                    <p className="text-gray-800 font-medium">
                      {application.applicant.name}
                    </p>
                    <p className="text-gray-600">
                      {application.applicant.email}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700">Position</h3>
                    <p className="text-gray-800">{application.job.jobTitle}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700">Applied On</h3>
                    <p className="text-gray-800">
                      {formatDate(application.submittedAt)}
                    </p>
                  </div>
                  {jobDetails?.status && (
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700">Job Status</h3>
                      <p className="text-gray-800">
                        {jobDetails.status.charAt(0).toUpperCase() + jobDetails.status.slice(1)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Matching Score Chart */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 mb-3">Matching Score Analysis</h3>
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
            </CardContent>
          </Card>

          {application.missingFeedback && (
            <MissingRequirementsCard feedback={application.missingFeedback} />
          )}

          {application.note && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>HR Evaluation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4 whitespace-pre-wrap text-gray-700">
                  {application.note}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 