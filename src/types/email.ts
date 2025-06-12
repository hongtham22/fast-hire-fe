/**
 * Email Template interface
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject_template: string;
  body_template: string;
  created_at: string;
  updated_at: string;
}

/**
 * Mail Log interface
 */
export interface MailLog {
  id: string;
  applicationId: string;
  emailTemplateId: string;
  subject: string;
  message: string;
  createdBy: string;
  sent_at: string;
  emailTemplate?: EmailTemplate;
  creator?: {
    id: string;
    name?: string;
    email: string;
  };
}

/**
 * Email preview response
 */
export interface EmailPreview {
  subject: string;
  body: string;
}

/**
 * Email notification response
 */
export interface EmailNotificationResponse {
  success: boolean;
  successCount?: number;
  failedApplications?: string[];
  skippedApplications?: string[];
  mailLog?: MailLog; 
} 