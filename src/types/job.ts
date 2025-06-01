/**
 * Job description structured data
 */
export interface JobKeywordData {
  role_job?: {
    value: string;
    requirement_type: string;
  };
  experience_years?: {
    value: string;
    requirement_type: string;
  };
  education?: Array<{
    degree: {
      value: string;
      requirement_type: string;
    };
    major: {
      value: string;
      requirement_type: string;
    };
  }>;
  programming_language?: Array<{
    value: string;
    requirement_type: string;
  }>;
  technical_skill?: Array<{
    value: string;
    requirement_type: string;
  }>;
  soft_skill?: Array<{
    value: string;
    requirement_type: string;
  }>;
  language?: Array<{
    language: {
      value: string;
      requirement_type: string;
    };
    level: {
      value: string;
      requirement_type: string;
    };
  }>;
  certificate?: Array<{
    value: string;
    requirement_type: string;
  }>;
  key_responsibilities?: Array<{
    value: string;
    requirement_type: string;
  }>;
  custom_max_scores?: {
    role_job: number;
    experience_years: number;
    programming_language: number;
    key_responsibilities: number;
    certificate: number;
    language: number;
    soft_skill: number;
    technical_skill: number;
  };
}

/**
 * Job list item for HR/Admin dashboard
 */
export interface JobListItem {
  id: string;
  jobTitle: string;
  location: string;
  applicationCount: number;
  status: 'pending' | 'approved' | 'closed' | 'rejected';
  expireDate: string | null;
  createdAt: string;
}

/**
 * Job list response wrapper
 */
export interface JobListResponse {
  jobs: JobListItem[];
  total: number;
}

/**
 * Detailed job information
 */
export interface JobDetail {
  id: string;
  jobTitle: string;
  description: string;
  location: {
    id: string;
    name: string;
  };
  status?: string;
  createdAt?: string;
  expireDate?: string | null;
  experienceYear?: number;
}

/**
 * Location interface
 */
export interface Location {
  id: string;
  name: string;
}

/**
 * Job Description Parser input
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
 * Extended job posting interface for admin job approvals with additional fields
 */
export interface JobPosting extends Omit<JobListItem, 'location'> {
  location: Location;
  experienceYear?: number;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  mustHave?: string;
  niceToHave?: string;
  languageSkills?: string;
  keyResponsibility?: string;
  ourOffer?: string;
  maxScoreRoleJob?: number;
  maxScoreExperienceYears?: number;
  maxScoreProgrammingLanguage?: number;
  maxScoreKeyResponsibilities?: number;
  maxScoreCertificate?: number;
  maxScoreLanguage?: number;
  maxScoreSoftSkill?: number;
  maxScoreTechnicalSkill?: number;
}

/**
 * Extended job list item for HR dashboard with additional fields
 */
export interface ExtendedJobListItem extends JobListItem {
  totalApplications?: number;
} 