import { API_AI_URL, FEATURES, API_TIMEOUT } from './config';
import { 
  ApiResponse,
  CVParserResponse,
} from '@/types/api';
import { 
  JobDescriptionInput,
  JobDescriptionData,
  JobListItem,
  JobListResponse,
  JobDetail,
  Location,
  JobKeywordData 
} from '@/types/job';
import { 
  Application,
  DetailedApplication,
  CVKeywordsResponse,
  MatchingInput,
  CandidateData
} from '@/types/application';
import { 
  EmailTemplate,
  EmailPreview,
  EmailNotificationResponse 
} from '@/types/email';
import { 
  HRUser,
  CreateHRUserData,
  UpdateHRUserData,
  ChangeHRPasswordData,
  ChangeOwnPasswordData 
} from '@/types/user';
import {
  DashboardStats,
  RecentApplication,
  JobMatchingScore,
  DashboardData
} from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Enhanced API call function with comprehensive error handling
 */
export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response | undefined> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const token = localStorage.getItem('token');
    
    // Determine if we're sending FormData
    const isFormData = options.body instanceof FormData;
    
    // Don't automatically set Content-Type for FormData
    const headers = !isFormData ? {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    } : {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    if (FEATURES.enableDebugLogging) {
      console.log(`API Request: ${endpoint}`, { ...options, headers });
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

    if (FEATURES.enableDebugLogging && response.ok) {
      console.log(`API Response: ${endpoint}`, response.status);
    }

    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout:', endpoint);
      throw new Error(`Request timed out after ${API_TIMEOUT/1000} seconds`);
    }
    
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * AI API call function (similar to apiCall but for AI endpoints)
 */
const aiApiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response | undefined> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    // Determine if we're sending FormData
    const isFormData = options.body instanceof FormData;
    
    // Don't automatically set Content-Type for FormData
    const headers = !isFormData ? {
      'Content-Type': 'application/json',
      ...options.headers,
    } : {
      ...options.headers
    };

    if (FEATURES.enableDebugLogging) {
      console.log(`AI API Request: ${endpoint}`, { ...options, headers });
    }

    const response = await fetch(`${API_AI_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (FEATURES.enableDebugLogging && response.ok) {
      console.log(`AI API Response: ${endpoint}`, response.status);
    }

    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('AI API Request timeout:', endpoint);
      throw new Error(`Request timed out after ${API_TIMEOUT/1000} seconds`);
    }
    
    console.error('AI API Error:', error);
    throw error;
  }
};

/**
 * Generic API wrapper that handles response parsing and error formatting
 */
async function handleApiResponse<T>(
  apiCallPromise: Promise<Response | undefined>
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCallPromise;
    
    if (!response) {
      throw new Error('No response received');
    }
    
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

    const data = await response.json();
    return { data, error: null };
  } catch (error: unknown) {
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
  
  return handleApiResponse<CVParserResponse>(
    aiApiCall('/parse-cv', {
      method: 'POST',
      body: formData,
      headers: {} // Empty headers to prevent Content-Type being set automatically
    })
  );
}


/**
 * Fetch all jobs for HR with application counts (HR can only see their own jobs)
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
  
  return handleApiResponse<JobListResponse>(
    apiCall(`/jobs/hr/all${queryString}`)
  );
}

/**
 * Fetch all jobs for Admin with application counts (Admin can see all jobs)
 */
export async function getJobsForAdmin(options?: {
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
  
  return handleApiResponse<JobListResponse>(
    apiCall(`/jobs/admin/all${queryString}`)
  );
}

/**
 * Fetch job keywords for a specific job ID from the public endpoint
 */
export async function getPublicJobKeywords(jobId: string): Promise<ApiResponse<JobKeywordData>> {
  return handleApiResponse<JobKeywordData>(
    apiCall(`/jobs/${jobId}/keywords`)
  );
}

/**
 * Fetch applications for a specific job ID
 */
export async function getApplicationsByJobId(jobId: string): Promise<ApiResponse<Application[]>> {
  return handleApiResponse<Application[]>(
    apiCall(`/applications/by-job/${jobId}`)
  );
}

/**
 * Fetch all candidates from jobs created by the current HR user
 */
export async function getCandidatesForHR(): Promise<ApiResponse<CandidateData[]>> {
  return handleApiResponse<CandidateData[]>(
    apiCall('/applications/hr/candidates')
  );
}

/**
 * Fetch applications history for a specific applicant ID
 */
export async function getApplicationsByApplicantId(applicantId: string): Promise<ApiResponse<DetailedApplication[]>> {
  return handleApiResponse<DetailedApplication[]>(
    apiCall(`/applications/by-applicant/${applicantId}`)
  );
}

/**
 * Fetch CV keywords for a specific application ID
 */
export async function getCVKeywords(applicationId: string): Promise<ApiResponse<CVKeywordsResponse>> {
  return handleApiResponse<CVKeywordsResponse>(
    apiCall(`/cv-keywords/by-application/${applicationId}`)
  );
}

/**
 * Fetch application details by ID
 */
export async function getApplicationById(applicationId: string): Promise<ApiResponse<Application>> {
  return handleApiResponse<Application>(
    apiCall(`/applications/${applicationId}`)
  );
}

/**
 * Fetch job details by ID
 */
export async function getJobDetail(jobId: string): Promise<ApiResponse<JobDetail>> {
  return handleApiResponse<JobDetail>(
    apiCall(`/jobs/${jobId}`)
  );
}

/**
 * Fetch all locations
 */
export async function getLocations(): Promise<ApiResponse<Location[]>> {
  return handleApiResponse<Location[]>(
    apiCall('/locations')
  );
}

/**
 * Delete a job and its related data
 */
export async function deleteJob(jobId: string): Promise<ApiResponse<{ message: string }>> {
  return handleApiResponse<{ message: string }>(
    apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
    })
  );
}

/**
 * Get all email templates
 */
export async function getEmailTemplates(): Promise<ApiResponse<EmailTemplate[]>> {
  return handleApiResponse<EmailTemplate[]>(
    apiCall('/email/templates', {
      method: 'GET',
    })
  );
}

/**
 * Preview email for an application with a specific template
 */
export async function previewEmail(applicationId: string, templateId: string): Promise<ApiResponse<EmailPreview>> {
  return handleApiResponse<EmailPreview>(
    apiCall(`/email/preview/${applicationId}/${templateId}`, {
      method: 'GET',
    })
  );
}

/**
 * Send email notification to a single application
 */
export async function sendSingleNotification(applicationId: string, templateId: string, markAsSent: boolean = true): Promise<ApiResponse<EmailNotificationResponse>> {
  return handleApiResponse<EmailNotificationResponse>(
    apiCall('/email/send-notification/single', {
      method: 'POST',
      body: JSON.stringify({ 
        applicationId, 
        templateId,
        markAsSent,
      }),
    })
  );
}

/**
 * Send email notifications to multiple applications
 */
export async function sendBulkNotifications(applicationIds: string[], templateId: string, markAsSent: boolean = true): Promise<ApiResponse<EmailNotificationResponse>> {
  return handleApiResponse<EmailNotificationResponse>(
    apiCall('/email/send-notification/bulk', {
      method: 'POST',
      body: JSON.stringify({ 
        applicationIds, 
        templateId,
        markAsSent,
      }),
    })
  );
}

/**
 * Helper function for password validation
 */
function validatePasswordData(passwordData: ChangeHRPasswordData | ChangeOwnPasswordData): string | null {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    return 'Passwords do not match';
  }
  
  if (passwordData.newPassword.length < 5) {
    return 'Password must be at least 5 characters long';
  }
  
  if ('currentPassword' in passwordData && !passwordData.currentPassword) {
    return 'Current password is required';
  }
  
  return null;
}

/**
 * Helper function to get current user ID
 */
function getCurrentUserId(): { userId: string | null; error: string | null } {
  try {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      return { userId: null, error: 'User session not found. Please login again.' };
    }

    const userData = JSON.parse(userDataString);
    const userId = userData.id;

    if (!userId) {
      return { userId: null, error: 'User ID not found. Please login again.' };
    }

    return { userId, error: null };
  } catch {
    return { userId: null, error: 'Invalid user session. Please login again.' };
  }
}

/**
 * Create a new HR user account
 */
export async function createHRUser(userData: CreateHRUserData): Promise<ApiResponse<HRUser>> {
  return handleApiResponse<HRUser>(
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        role: 'hr'
      }),
    })
  );
}

/**
 * Get all HR users only (for admin management)
 */
export async function getAllUsers(includeInactive: boolean = true): Promise<ApiResponse<HRUser[]>> {
  const queryParam = includeInactive ? '?includeInactive=true' : '';
  return handleApiResponse<HRUser[]>(
    apiCall(`/users/hr-users${queryParam}`)
  );
}

/**
 * Update HR user
 */
export async function updateHRUser(userId: string, userData: UpdateHRUserData): Promise<ApiResponse<HRUser>> {
  return handleApiResponse<HRUser>(
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  );
}

/**
 * Update Own Profile (for HR users updating their own profile)
 */
export async function updateOwnProfile(userData: UpdateHRUserData): Promise<ApiResponse<HRUser>> {
  const { userId, error: userIdError } = getCurrentUserId();
  
  if (userIdError) {
    return { data: null, error: userIdError };
  }

  return handleApiResponse<HRUser>(
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  );
}

/**
 * Deactivate HR user (soft delete)
 */
export async function deactivateHRUser(userId: string): Promise<ApiResponse<{ message: string }>> {
  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
}

/**
 * Activate HR user
 */
export async function activateHRUser(userId: string): Promise<ApiResponse<{ message: string }>> {
  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
}

/**
 * Delete HR user (hard delete - keep for emergency use)
 */
export async function deleteHRUser(userId: string): Promise<ApiResponse<{ message: string }>> {
  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );
}

/**
 * Change HR User Password
 */
export async function changeHRUserPassword(userId: string, passwordData: ChangeHRPasswordData): Promise<ApiResponse<{ message: string }>> {
  const validationError = validatePasswordData(passwordData);
  if (validationError) {
    return { data: null, error: validationError };
  }

  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: passwordData.newPassword
      }),
    })
  );
}

/**
 * Change Own Password (for HR users changing their own password)
 */
export async function changeOwnPassword(passwordData: ChangeOwnPasswordData): Promise<ApiResponse<{ message: string }>> {
  const validationError = validatePasswordData(passwordData);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const { userId, error: userIdError } = getCurrentUserId();
  if (userIdError) {
    return { data: null, error: userIdError };
  }

  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }),
    })
  );
}

/**
 * Reset HR User Password (Admin only)
 */
export async function resetHRUserPassword(userId: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
  if (newPassword.length < 5) {
    return { data: null, error: 'Password must be at least 5 characters long' };
  }

  return handleApiResponse<{ message: string }>(
    apiCall(`/users/${userId}/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword
      }),
    })
  );
}

// =============================================================================
// ADMIN DASHBOARD API FUNCTIONS
// =============================================================================

/**
 * Get dashboard statistics (total candidates, jobs, HR, avg matching score)
 */
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return handleApiResponse<DashboardStats>(
    apiCall('/admin/dashboard/stats')
  );
}

/**
 * Get recent applications for dashboard
 */
export async function getRecentApplications(): Promise<ApiResponse<RecentApplication[]>> {
  return handleApiResponse<RecentApplication[]>(
    apiCall('/admin/dashboard/recent-applications')
  );
}

/**
 * Get job matching scores for dashboard
 */
export async function getJobMatchingScores(): Promise<ApiResponse<JobMatchingScore[]>> {
  return handleApiResponse<JobMatchingScore[]>(
    apiCall('/admin/dashboard/job-matching-scores')
  );
}

/**
 * Get applications chart data
 */
export async function getApplicationsChartData(): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
  return handleApiResponse<{ labels: string[]; data: number[] }>(
    apiCall('/admin/dashboard/applications-chart')
  );
}

/**
 * Get complete dashboard data (combines all dashboard endpoints)
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  try {
    console.log('Fetching dashboard data from API...');
    
    const [statsResult, applicationsResult, matchingScoresResult, chartResult] = await Promise.all([
      getDashboardStats(),
      getRecentApplications(),
      getJobMatchingScores(),
      getApplicationsChartData(),
    ]);

    // Check for any errors in individual requests
    if (statsResult.error) {
      throw new Error(`Failed to load statistics: ${statsResult.error}`);
    }
    if (applicationsResult.error) {
      throw new Error(`Failed to load recent applications: ${applicationsResult.error}`);
    }
    if (chartResult.error) {
      throw new Error(`Failed to load chart data: ${chartResult.error}`);
    }

    // Ensure all data exists
    if (!statsResult.data || !applicationsResult.data || !matchingScoresResult.data || !chartResult.data) {
      throw new Error('Incomplete data received from API');
    }

    console.log('Successfully loaded all dashboard data');

    const dashboardData: DashboardData = {
      stats: statsResult.data,
      recentApplications: applicationsResult.data,
      applicationsChart: {
        labels: chartResult.data.labels,
        datasets: [
          {
            label: 'Applications',
            data: chartResult.data.data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1,
          },
        ],
      },
      jobMatchingScores: matchingScoresResult.data,
    };

    return { data: dashboardData, error: null };
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('fetch')) {
        return {
          data: null,
          error: 'Cannot connect to the server. Please ensure the backend API is running and accessible.'
        };
      }
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return {
          data: null,
          error: 'Authentication failed. Please login again.'
        };
      }
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        return {
          data: null,
          error: 'Access denied. You do not have permission to view this dashboard.'
        };
      }
      if (error.message.includes('404')) {
        return {
          data: null,
          error: 'Dashboard API endpoint not found. Please check the API configuration.'
        };
      }
      if (error.message.includes('500')) {
        return {
          data: null,
          error: 'Server error occurred. Please try again later or contact support.'
        };
      }
      return { data: null, error: error.message };
    }
    
    return { data: null, error: 'An unexpected error occurred while loading dashboard data.' };
  }
}

// Re-export types for easier access
export type {
  ApiResponse,
  CVParserResponse,
  JobDescriptionInput,
  JobDescriptionData,
  MatchingInput,
  JobListItem,
  JobListResponse,
  JobDetail,
  Location,
  Application,
  CVKeywordsResponse,
  EmailTemplate,
  HRUser,
  CreateHRUserData,
  UpdateHRUserData,
  ChangeHRPasswordData,
  ChangeOwnPasswordData,
  // Admin Dashboard types
  DashboardStats,
  RecentApplication,
  JobMatchingScore,
  DashboardData,
}; 
