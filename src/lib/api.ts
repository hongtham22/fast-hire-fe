import { API_AI_URL, FEATURES, API_TIMEOUT } from './config';
import { 
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
  MatchingResult
} from '@/types/api';

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

// Re-export types for easier access
export type {
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
  MatchingResult
}; 
