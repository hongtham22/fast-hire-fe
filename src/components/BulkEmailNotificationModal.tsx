"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getEmailTemplates, sendBulkNotifications, EmailTemplate } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface BulkEmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationIds: string[];
  statusText: string;
  preferredTemplateName?: string;
}

export default function BulkEmailNotificationModal({
  isOpen,
  onClose,
  applicationIds,
  statusText,
  preferredTemplateName,
}: BulkEmailNotificationModalProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await getEmailTemplates();
      
      if (error) {
        setError(`Failed to fetch email templates: ${error}`);
      } else if (data) {
        setTemplates(data);
        
        // Auto-select preferred template if specified
        let selectedTemplate = null;
        if (preferredTemplateName) {
          selectedTemplate = data.find(t => t.name === preferredTemplateName);
        }
        
        // Fallback to first template if preferred not found
        if (!selectedTemplate && data.length > 0) {
          selectedTemplate = data[0];
        }
        
        if (selectedTemplate) {
          setSelectedTemplateId(selectedTemplate.id);
          setSelectedTemplate(selectedTemplate);
        }
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("An error occurred while fetching email templates");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handleSendEmails = async () => {
    if (!selectedTemplateId) {
      setError("Please select an email template");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { data, error } = await sendBulkNotifications(applicationIds, selectedTemplateId);
      
      if (error) {
        setError(`Failed to send emails: ${error}`);
      } else if (data) {
        const { success, successCount, failedApplications, skippedApplications } = data;
        
        if (!success) {
          setError('Failed to send emails');
        } else {
          let resultMessage = `Successfully sent ${successCount || 0} emails`;
          
          if (skippedApplications && skippedApplications.length > 0) {
            resultMessage += `\n\nSkipped ${skippedApplications.length} applications:`;
            skippedApplications.forEach((skip, index) => {
              if (index < 3) { // Show first 3 skipped items
                resultMessage += `\n• ${skip}`;
              } else if (index === 3) {
                resultMessage += `\n• ...and ${skippedApplications.length - 3} more`;
              }
            });
          }
          
          if (failedApplications && failedApplications.length > 0) {
            resultMessage += `\n\nFailed ${failedApplications.length} applications:`;
            failedApplications.forEach((fail, index) => {
              if (index < 2) { // Show first 2 failed items
                resultMessage += `\n• ${fail}`;
              } else if (index === 2) {
                resultMessage += `\n• ...and ${failedApplications.length - 2} more`;
              }
            });
          }
          
          setSuccess(resultMessage);
          setTimeout(() => {
            onClose();
          }, 4000); // Increased timeout to read the detailed message
        }
      }
    } catch (err) {
      console.error("Error sending emails:", err);
      setError("An error occurred while sending the emails");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Send Bulk Email Notifications</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          <p className="mb-6">
            You are about to send email notifications to <span className="font-bold">{applicationIds.length}</span> candidates with status &rdquo;<span className="font-bold">{statusText}</span>&ldquo;.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-sans">{success}</pre>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="bulkTemplate" className="block font-medium mb-1">
              Select Email Template
            </label>
            <select
              id="bulkTemplate"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              className="w-full p-2 border rounded-md border-gray-300"
              disabled={loading || templates.length === 0}
            >
              {templates.length === 0 ? (
                <option value="">No templates available</option>
              ) : (
                templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedTemplate && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Template Preview</h3>
              <div className="border rounded-md p-4">
                <div className="mb-2">
                  <span className="font-medium">Subject Template: </span>
                  {selectedTemplate.subject_template}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="prose max-w-none">
                    <h4 className="text-sm font-medium mb-1">Body Template:</h4>
                    <div 
                      className="text-sm bg-gray-50 p-3 rounded overflow-auto max-h-40 prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.body_template }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: The template will be personalized with each candidate&rsquo;s information before sending.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmails}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading || !selectedTemplateId}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                `Send to ${applicationIds.length} Candidates`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 