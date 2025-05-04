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
 * CV Parser API types
 */
export interface CVParserResponse {
  raw_text: string;
  structured_data: StructuredData;
}

export interface JobKeyworRespone {
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
