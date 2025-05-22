"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { getEmailTemplates, previewEmail, sendSingleNotification, EmailTemplate } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
}

export default function EmailNotificationModal({
  isOpen,
  onClose,
  applicationId,
}: EmailNotificationModalProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        if (data.length > 0) {
          setSelectedTemplateId(data[0].id);
          handlePreviewEmail(data[0].id);
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
    handlePreviewEmail(templateId);
  };

  const handlePreviewEmail = async (templateId: string) => {
    if (!templateId) return;
    
    setPreviewLoading(true);
    setEmailPreview(null);
    
    try {
      const { data, error } = await previewEmail(applicationId, templateId);
      
      if (error) {
        setError(`Failed to preview email: ${error}`);
      } else if (data) {
        setEmailPreview(data);
      }
    } catch (err) {
      console.error("Error previewing email:", err);
      setError("An error occurred while previewing the email");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplateId) {
      setError("Please select an email template");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await sendSingleNotification(applicationId, selectedTemplateId);
      
      if (error) {
        setError(`Failed to send email: ${error}`);
      } else {
        setSuccess("Email sent successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setError("An error occurred while sending the email");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Send Email Notification</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="template" className="block font-medium mb-1">
              Select Email Template
            </label>
            <select
              id="template"
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

          <div className="mb-6">
            <h3 className="font-medium mb-2">Email Preview</h3>
            {previewLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : emailPreview ? (
              <div className="border rounded-md p-4">
                <div className="mb-2">
                  <span className="font-medium">Subject: </span>
                  {emailPreview.subject}
                </div>
                <div className="border-t pt-2">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: emailPreview.body }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic text-center p-4">
                Select a template to preview the email
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading || !selectedTemplateId}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 