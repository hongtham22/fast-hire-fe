"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import JobKeywordViewer from "./JobKeywordViewer";
import { useJobs } from "@/app/context/JobsContext";

interface KeywordAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

const KeywordAnalysisModal: React.FC<KeywordAnalysisModalProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const { fetchJobById } = useJobs();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      if (jobId) {
        setLoading(true);
        const jobData = await fetchJobById(jobId);
        setJob(jobData);
        setLoading(false);
      }
    };

    if (isOpen) {
      loadJob();
    }
  }, [isOpen, jobId, fetchJobById]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">
            JD Analysis: {job?.title || job?.jobTitle || "Job"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left panel: Job Description */}
          <div className="w-1/2 p-4 overflow-y-auto border-r">
            <h3 className="text-xl font-bold mb-4">Job Description</h3>
            {loading ? (
              <p>Loading job details...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">Key Responsibilities</h4>
                  <p className="whitespace-pre-line">{job?.keyResponsibility}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold">Must Have</h4>
                  <p className="whitespace-pre-line">{job?.mustHave}</p>
                </div>
                
                {job?.niceToHave && (
                  <div>
                    <h4 className="text-lg font-semibold">Nice to Have</h4>
                    <p className="whitespace-pre-line">{job?.niceToHave}</p>
                  </div>
                )}
                
                {job?.languageSkills && (
                  <div>
                    <h4 className="text-lg font-semibold">Language Skills</h4>
                    <p className="whitespace-pre-line">{job?.languageSkills}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: Extracted Keywords */}
          <div className="w-1/2 p-4 overflow-y-auto bg-gray-50">
            <h3 className="text-xl font-bold mb-4">Extracted Keywords</h3>
            <JobKeywordViewer jobId={jobId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalysisModal; 