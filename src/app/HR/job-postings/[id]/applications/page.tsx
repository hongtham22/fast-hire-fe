"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Filter, ArrowLeft, Loader2, FileText } from "lucide-react";
import { getApplicationsByJobId, Application } from "@/lib/api";

// Interface for the API response from backend
interface ApplicationApiResponse {
  id: string;
  applicantId: string;
  jobId: string;
  cvFileUrl: string;
  submittedAt: string;
  matchingScore: number | null;
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
}

// Extended Application interface to include cvFileUrl
interface ApplicationWithCV extends Application {
  cvFileUrl?: string;
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  
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
          const apiResponse = response.data as unknown as ApplicationApiResponse[];
          
          // Map the API response to our Application interface
          applicationsData = apiResponse.map(item => {
            // Map result (boolean | null) to status string
            let status: Application['status'];
            if (item.result === true) {
              status = 'hired';
            } else if (item.result === false) {
              status = 'rejected';
            } else {
              // If result is null, use new status
              status = 'new';
            }
            
            // Format the application to match our Application interface
            return {
              id: item.id,
              applicant: {
                id: item.applicant?.id || item.applicantId || '',
                name: item.applicant?.name || 'Unknown',
                email: item.applicant?.email || 'No email provided',
              },
              job: {
                id: item.jobId || '',
                jobTitle: item.job?.jobTitle || 'Unknown Position',
              },
              matchScore: item.matchingScore !== null ? Number(item.matchingScore) : undefined,
              status: status,
              createdAt: item.submittedAt || new Date().toISOString(),
              cvFileUrl: item.cvFileUrl, // Include CV file URL
            };
          });

          // If we have applications and job title is not known yet
          if (applicationsData.length > 0 && !jobTitle) {
            setJobTitle(applicationsData[0].job.jobTitle);
          }
        } else if (response.data && typeof response.data === 'object') {
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

  const openCVFile = (cvFileUrl: string | undefined) => {
    if (!cvFileUrl) {
      alert('CV file not available');
      return;
    }
    
    // Determine if this is a full URL or a relative path
    let fullUrl: string;
    if (cvFileUrl.startsWith('http://') || cvFileUrl.startsWith('https://')) {
      fullUrl = cvFileUrl;
    } else {
      // If it's a relative path, construct the full URL
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3000';
      fullUrl = `${baseUrl}/${cvFileUrl.startsWith('/') ? cvFileUrl.slice(1) : cvFileUrl}`;
    }
    
    // Open in a new tab
    window.open(fullUrl, '_blank');
  };

  const filteredApplications = applications.filter(app => 
    app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

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
      case 'hired':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'new':
        return 'Not Evaluated';
      default:
        return status.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
            {jobTitle ? `Applications for ${jobTitle}` : 'View all applications for this job position'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
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
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      
      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-8 gap-4 border-b bg-gray-50 px-6 py-3 font-medium">
          <div className="col-span-2">Candidate</div>
          <div>Email</div>
          <div>Match Score</div>
          <div>Date Applied</div>
          <div>Status</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'No applications found matching your search.' : 'No applications for this job posting yet.'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredApplications.map((application) => (
              <div key={application.id} className="grid grid-cols-8 gap-4 px-6 py-4">
                <div className="col-span-2 font-medium">{application.applicant.name}</div>
                <div className="text-gray-600">{application.applicant.email}</div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    (application.matchScore || 0) >= 90 
                      ? "bg-green-100 text-green-700" 
                      : (application.matchScore || 0) >= 80 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {application.matchScore || "N/A"}%
                  </span>
                </div>
                <div className="text-gray-600">{formatDate(application.createdAt)}</div>
                <div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                    {getStatusDisplay(application.status)}
                  </span>
                </div>
                <div className="col-span-2 space-x-2">
                  <button 
                    className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50"
                    onClick={() => openCVFile(application.cvFileUrl)}
                  >
                    <span className="flex items-center">
                      <FileText className="mr-1 h-3 w-3" />
                      View CV
                    </span>
                  </button>
                  <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                    View
                  </button>
                  <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                    Process
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 