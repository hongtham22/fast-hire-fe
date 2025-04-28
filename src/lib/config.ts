/**
 * Application configuration
 */

// API URLs
export const API_AI_URL = process.env.NEXT_PUBLIC_API_AI_URL || 'http://127.0.0.1:5000';
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3000';

// Feature flags
export const FEATURES = {
  enableDebugLogging: process.env.NODE_ENV === 'development',
};

// File upload settings
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = {
  PDF: 'application/pdf',
  // DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // TXT: 'text/plain',
};

// API timeout settings
export const API_TIMEOUT = 30000; // 30 seconds

// Retry settings
export const MAX_RETRY_ATTEMPTS = 2;
export const RETRY_DELAY = 1000; // 1 second 