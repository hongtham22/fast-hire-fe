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
} 