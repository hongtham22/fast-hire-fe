"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, X } from "lucide-react";
import { getEmailTemplates, EmailTemplate } from "@/lib/api";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await getEmailTemplates();
      
      if (error) {
        setError(`Failed to fetch email templates: ${error}`);
      } else if (data) {
        setTemplates(data);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      setError("An error occurred while fetching email templates");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getCategoryFromName = (name: string) => {
    // Determine category based on template name
    if (name == 'Application Received') {
      return "Automatic";
    }
    return "Manual";
  };

  const getDescription = (name: string) => {
    // Generate description based on template name
    const descriptions: { [key: string]: string } = {
      "Application Received": "Confirmation email sent after receiving an application",
      "Interview Invitation": "Invitation for an interview with schedule details", 
      "Application Rejected": "Rejection notice for applicants that don't match criteria",
      "Application Accepted": "Congratulations email for successful applications",
      "Job Offer": "Official job offer with position and salary details"
    };
    
    return descriptions[name] || "Email template for candidate communication";
  };

  const handleTemplateClick = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-gray-500">View templates for communication with candidates</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {templates.map((template) => {
            const category = getCategoryFromName(template.name);
            const description = getDescription(template.name);
            const lastModified = formatDate(template.updated_at);
            
            return (
              <div 
                key={template.id} 
                className="rounded-xl border p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTemplateClick(template)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium">{template.name}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">{description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    category === "Automatic" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {category}
                  </span>
                  <span className="text-xs text-gray-500">Modified {lastModified}</span>
                </div>
                <button className="mt-4 w-full rounded-md border border-blue-600 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                  View Template
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && templates.length === 0 && !error && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No email templates found</p>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                  <p className="text-gray-500">Email Template Preview</p>
                </div>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Subject Template</h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <p className="text-gray-800">{selectedTemplate.subject_template}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Body Template</h3>
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <div 
                      className="prose max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.body_template }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Created:</strong> {new Date(selectedTemplate.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Last Modified:</strong> {new Date(selectedTemplate.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 