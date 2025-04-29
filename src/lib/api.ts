import { API_AI_URL, FEATURES, API_TIMEOUT } from './config';
import { 
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
  MatchingResult
} from '@/types/api';

// Types for the HR Job API
export interface JobListItem {
  id: string;
  jobTitle: string;
  department: string;
  applicationCount: number;
  status: 'pending' | 'approved' | 'closed';
  expireDate: string | null;
  createdAt: string;
}

export interface JobListResponse {
  jobs: JobListItem[];
  total: number;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3000';

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
 * CV-JD Matching API
 */
export async function evaluateMatching(
  matchingData: MatchingInput
): Promise<ApiResponse<MatchingResult>> {
  return fetchApi<MatchingResult>('/evaluate-matching', {
    method: 'POST',
    body: JSON.stringify(matchingData),
  });
}

/**
 * Fetch all jobs for HR with application counts
 */
export async function getJobsForHR(options?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'closed';
  query?: string;
}): Promise<ApiResponse<JobListResponse>> {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (options?.page) queryParams.append('page', options.page.toString());
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.status) queryParams.append('status', options.status);
  if (options?.query) queryParams.append('query', options.query);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return fetch(`${API_BASE_URL}/jobs/hr/all${queryString}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => ({ data, error: null }))
    .catch(error => {
      console.error('API Error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    });
}

// Re-export types for easier access
export type {
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
  MatchingResult
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
}

/**
 * Fetch applications for a specific job ID
 */
export async function getApplicationsByJobId(jobId: string): Promise<ApiResponse<Application[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/applications/by-job/${jobId}`);
    
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
