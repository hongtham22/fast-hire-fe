import { StructuredData } from './cv';

/**
 * Application interface for job applications
 */
export interface Application {
  id: string;
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    jobTitle: string;
  };
  matchScore?: number;
  status: 'new' | 'rejected' | 'accepted';
  createdAt: string;
  cvFileUrl?: string;
}

/**
 * Interface for the API response from backend for job applications
 */
export interface ApplicationApiResponse {
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
  emailSent?: boolean;
}

/**
 * Extended Application interface to include cvFileUrl and detailed scores
 */
export interface ApplicationWithCV extends Application {
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

/**
 * Extended Application interface with detailed matching scores
 */
export interface DetailedApplication {
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
  emailSent: boolean;
  applicant: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    jobTitle: string;
  };
  status?: string; // Optional status field used in some components
}

/**
 * CV keywords response interface
 */
export interface CVKeywordsResponse {
  raw_text: string;
  structured_data: StructuredData;
}

/**
 * CV-JD Matching API types
 */
export interface MatchingInput {
  cv_text: string;
  jd_data: { [category: string]: string[] };
}

/**
 * Match field interface for comparison results
 */
export interface MatchField {
  field: string;
  cv_value: string;
  jd_value: string;
}

/**
 * Candidate data interface for HR candidates page
 */
export interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  technical_skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
  education: Array<{
    major: string;
    university: string;
    gpa: string;
    degree: string;
    graduation_year: string;
  }>;
  experience_years: number | null;
  latest_company: string | null;
  totalApplications: number;
  latestApplication: {
    id: string;
    jobTitle: string;
    submittedAt: string;
    matchingScore: number | null;
    result: boolean | null;
    status: 'accepted' | 'rejected' | 'pending';
  };
  applications: Array<{
    id: string;
    jobId: string;
    jobTitle: string;
    submittedAt: string;
    matchingScore: number | null;
    result: boolean | null;
    status: 'accepted' | 'rejected' | 'pending';
  }>;
} 