import { API_AI_URL, FEATURES, API_TIMEOUT } from './config';
import { 
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
} from '@/types/api';
import { StructuredData } from '@/types/cv';
import { JobKeywordData } from '@/types/job';

// Types for the HR Job API
export interface JobListItem {
  id: string;
  jobTitle: string;
  location: string;
  applicationCount: number;
  status: 'pending' | 'approved' | 'closed' | 'rejected';
  expireDate: string | null;
  createdAt: string;
}

export interface JobListResponse {
  jobs: JobListItem[];
  total: number;
}

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Add the Location interface
export interface Location {
  id: string;
  name: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Create an abort controller for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    if (FEATURES.enableDebugLogging) {
      console.log(`API Request: ${endpoint}`, options);
    }

    // Determine if we're sending FormData
    const isFormData = options.body instanceof FormData;
    
    // Don't automatically set Content-Type for FormData
    // The browser will set it with the correct boundary
    const headers = !isFormData ? {
      'Content-Type': 'application/json',
      ...options.headers,
    } : {
      ...options.headers
    };

    const response = await fetch(`${API_AI_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // Handle JSON error responses
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      } 
      // Handle non-JSON error responses
      else {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
    }

    // Parse response as JSON
    const data = await response.json();
    
    if (FEATURES.enableDebugLogging) {
      console.log(`API Response: ${endpoint}`, data);
    }
    
    return { data, error: null };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout:', endpoint);
      return {
        data: null,
        error: `Request timed out after ${API_TIMEOUT/1000} seconds`
      };
    }
    
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * CV Parser API
 */
export async function parseCV(formData: FormData): Promise<ApiResponse<CVParserResponse>> {
  // Validate that the form data contains a file
  const cvFile = formData.get('cv_file') as File | null;
  if (!cvFile) {
    return {
      data: null,
      error: 'No CV file provided. Please select a file.'
    };
  }
  
  try {
    // Remove Content-Type header to let the browser set it with the boundary
    return fetchApi<CVParserResponse>('/parse-cv', {
      method: 'POST',
      body: formData,
      headers: {} // Empty headers to prevent Content-Type being set automatically
    });
  } catch (error) {
    console.error('CV parser error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to upload CV file'
    };
  }
}

/**
 * Job Description Parser API
 */
export async function parseJobDescription(
  jobData: JobDescriptionInput
): Promise<ApiResponse<JobDescriptionData>> {
  return fetchApi<JobDescriptionData>('/parse-jd', {
    method: 'POST',
    body: JSON.stringify(jobData),
  });
}


/**
 * Fetch all jobs for HR with application counts
 */
export async function getJobsForHR(options?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'closed' | 'rejected';
  query?: string;
}): Promise<ApiResponse<JobListResponse>> {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (options?.page) queryParams.append('page', options.page.toString());
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.status) queryParams.append('status', options.status);
  if (options?.query) queryParams.append('query', options.query);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  try {
    const response = await apiCall(`/jobs/hr/all${queryString}`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Fetch job keywords for a specific job ID from the public endpoint
 * This uses the direct public URL that's known to work
 */
export async function getPublicJobKeywords(jobId: string): Promise<ApiResponse<JobKeywordData>> {
  try {
    const response = await apiCall(`/jobs/${jobId}/keywords`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Re-export types for easier access
export type {
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
}; 

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
  status: 'new' | 'in_review' | 'interview' | 'rejected' | 'hired';
  createdAt: string;
  cvFileUrl?: string;
}

/**
 * Fetch applications for a specific job ID
 */
export async function getApplicationsByJobId(jobId: string): Promise<ApiResponse<Application[]>> {
  try {
    const response = await apiCall(`/applications/by-job/${jobId}`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * CV keywords response interface
 */
export interface CVKeywordsResponse {
  raw_text: string;
  structured_data: StructuredData;
}

/**
 * Fetch CV keywords for a specific application ID
 */
export async function getCVKeywords(applicationId: string): Promise<ApiResponse<CVKeywordsResponse>> {
  try {
    const response = await apiCall(`/cv-keywords/by-application/${applicationId}`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Fetch application details by ID
 */
export async function getApplicationById(applicationId: string): Promise<ApiResponse<Application>> {
  try {
    const response = await apiCall(`/applications/${applicationId}`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Fetch job details by ID
 */
export async function getJobDetail(jobId: string): Promise<ApiResponse<JobDetail>> {
  try {
    const response = await apiCall(`/jobs/${jobId}`);
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Add function to fetch locations
export async function getLocations(): Promise<ApiResponse<Location[]>> {
  try {
    const response = await apiCall('/locations');
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Delete a job and its related data
 */
export async function deleteJob(jobId: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
    
    if (!response) {
      throw new Error('No response received');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<ApiResponse<EmailTemplate[]>> {
  try {
    const response = await apiCall('/email/templates', {
      method: 'GET',
    });

    if (!response) {
      throw new Error('No response received');
    }

    if (!response.ok) {
      throw new Error(`Error fetching email templates: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Preview email for an application with a specific template
 */
export async function previewEmail(applicationId: string, templateId: string): Promise<ApiResponse<{ subject: string; body: string }>> {
  try {
    const response = await apiCall(`/email/preview/${applicationId}/${templateId}`, {
      method: 'GET',
    });

    if (!response) {
      throw new Error('No response received');
    }

    if (!response.ok) {
      throw new Error(`Error previewing email: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Send email notification to a single application
 */
export async function sendSingleNotification(applicationId: string, templateId: string, markAsSent: boolean = true): Promise<ApiResponse<{success: boolean}>> {
  try {
    const response = await apiCall('/email/send-notification/single', {
      method: 'POST',
      body: JSON.stringify({ 
        applicationId, 
        templateId,
        markAsSent,
      }),
    });

    if (!response) {
      throw new Error('No response received');
    }

    if (!response.ok) {
      throw new Error(`Error sending notification: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Send email notifications to multiple applications
 */
export async function sendBulkNotifications(applicationIds: string[], templateId: string, markAsSent: boolean = true): Promise<ApiResponse<{success: boolean}>> {
  try {
    const response = await apiCall('/email/send-notification/bulk', {
      method: 'POST',
      body: JSON.stringify({ 
        applicationIds, 
        templateId,
        markAsSent,
      }),
    });

    if (!response) {
      throw new Error('No response received');
    }

    if (!response.ok) {
      throw new Error(`Error sending notifications: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject_template: string;
  body_template: string;
  created_at: string;
  updated_at: string;
}

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  return response;
}; 
