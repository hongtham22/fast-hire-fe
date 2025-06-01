import { StructuredData } from './cv';
import { JobKeywordData } from './job';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * CV Parser API response
 */
export interface CVParserResponse {
  raw_text: string;
  structured_data: StructuredData;
}

/**
 * Job keyword response (typo fixed from JobKeyworRespone)
 */
export interface JobKeywordResponse {
  jobKeywordData: JobKeywordData;
}

/**
 * Job Description Parser API types
 */
export interface JobDescriptionInput {
  jobTitle: string;
  location: string;
  experienceYears: string;
  keyResponsibilities: string;
  mustHave: string;
  niceToHave: string;
  languageSkills: string;
}

/**
 * Simple categorized keywords, returned from the JD parser
 */
export interface JobDescriptionData {
  [category: string]: string[];
}

/**
 * CV-JD Matching API types
 */
export interface MatchingInput {
  cv_text: string;
  jd_data: JobDescriptionData;
}

export interface MatchField {
  field: string;
  cv_value: string;
  jd_value: string;
}

export interface Application {
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