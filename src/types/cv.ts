export interface StructuredData {
  candidate: {
    name: string;
    location: string;
    email: string;
    phone: string;
    role_job: string;
    experience_years: string;
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    projects: Array<{
      name: string;
      tasks: string[];
    }>;
  }>;
  education: Array<{
    major: string;
    university: string;
    gpa: string;
    degree: string;
    graduation_year: string;
    duration: string;
  }>;
  language: Array<{
    language: string;
    level: string;
  }>;
  programming_language: string[];
  technical_skill: string[];
  soft_skill: string[];
  certificate: string[];
} 