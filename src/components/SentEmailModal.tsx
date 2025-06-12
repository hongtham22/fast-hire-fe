"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Mail, Calendar, User } from "lucide-react";
import {getApplicantJobMailLogs } from "@/lib/api";
import { MailLog } from "@/types/email";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SentEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  applicantId: string;
  jobId: string;
  applicantName: string;
}

export default function SentEmailModal({
  isOpen,
  onClose,
  applicantId,
  jobId,
  applicantName,
}: SentEmailModalProps) {
  const [mailLogs, setMailLogs] = useState<MailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && applicantId && jobId) {
      fetchMailLogs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, applicantId, jobId]);

  const fetchMailLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getApplicantJobMailLogs(applicantId, jobId);
      
      if (error) {
        setError(`Failed to fetch email logs: ${error}`);
      } else if (data) {
        // Backend already filters out "Application Received" emails and sorts by sent date
        setMailLogs(data);
      }
    } catch (err) {
      console.error("Error fetching mail logs:", err);
      setError("An error occurred while fetching email logs");
    } finally {
      setLoading(false);
    }
  };

  const getTemplateColor = (templateName: string) => {
    switch (templateName) {
      case "Application Accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Application Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Interview Invitation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sent Emails</h2>
                <p className="text-sm text-gray-600">
                  Email history for {applicantName}
                </p>
              </div>
            </div>
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

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : mailLogs.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No result emails found for this application.</p>
              <p className="text-sm text-gray-400 mt-1">
                Only evaluation result emails (accepted/rejected/interview) are shown here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mailLogs.map((mailLog, index) => (
                <div key={mailLog.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Email Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTemplateColor(mailLog.emailTemplate?.name || '')}`}>
                          {mailLog.emailTemplate?.name || 'Unknown Template'}
                        </span>
                        {index === 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(mailLog.sent_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Recipient:</span>
                        <span className="text-sm text-gray-900">{applicantName}</span>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Subject:</span>
                        <p className="text-gray-900 mt-1">{mailLog.subject}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700">Message:</span>
                      <div className="mt-2 p-4 bg-gray-50 rounded-md border">
                        <div 
                          className="prose prose-sm max-w-none text-gray-800"
                          dangerouslySetInnerHTML={{ __html: mailLog.message }}
                        />
                      </div>
                    </div>

                    {mailLog.creator && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Sent by:</span>
                          <span>{mailLog.creator.name || mailLog.creator.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 