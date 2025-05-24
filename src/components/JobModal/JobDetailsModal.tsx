import React from 'react';
import { X } from 'lucide-react';
import { Location } from '@/lib/api';

interface JobPostingDetails {
  id: string;
  jobTitle: string;
  location: Location;
  experienceYear?: number;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  mustHave?: string;
  niceToHave?: string;
  languageSkills?: string;
  keyResponsibility?: string;
  ourOffer?: string;
  status: 'pending' | 'approved' | 'closed' | 'rejected';
  createdAt: string;
  expireDate?: string | null;
  maxScoreRoleJob?: number;
  maxScoreExperienceYears?: number;
  maxScoreProgrammingLanguage?: number;
  maxScoreKeyResponsibilities?: number;
  maxScoreCertificate?: number;
  maxScoreLanguage?: number;
  maxScoreSoftSkill?: number;
  maxScoreTechnicalSkill?: number;
}

interface JobDetailsModalProps {
  job: JobPostingDetails | null;
  onClose: () => void;
  onApprove?: (jobId: string) => void;
  onReject?: (jobId: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ 
  job, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  if (!job) return null;

  // Check if job has any weight scores
  const hasWeightScores = job.maxScoreRoleJob !== undefined || 
    job.maxScoreExperienceYears !== undefined ||
    job.maxScoreProgrammingLanguage !== undefined ||
    job.maxScoreKeyResponsibilities !== undefined ||
    job.maxScoreCertificate !== undefined ||
    job.maxScoreLanguage !== undefined ||
    job.maxScoreSoftSkill !== undefined ||
    job.maxScoreTechnicalSkill !== undefined;

  // Calculate total weight score if available
  const calculateTotalWeight = () => {
    let total = 0;
    if (job.maxScoreRoleJob) total += job.maxScoreRoleJob;
    if (job.maxScoreExperienceYears) total += job.maxScoreExperienceYears;
    if (job.maxScoreProgrammingLanguage) total += job.maxScoreProgrammingLanguage;
    if (job.maxScoreKeyResponsibilities) total += job.maxScoreKeyResponsibilities;
    if (job.maxScoreCertificate) total += job.maxScoreCertificate;
    if (job.maxScoreLanguage) total += job.maxScoreLanguage;
    if (job.maxScoreSoftSkill) total += job.maxScoreSoftSkill;
    if (job.maxScoreTechnicalSkill) total += job.maxScoreTechnicalSkill;
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Job Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{job.jobTitle}</h3>
            <p className="text-sm text-gray-500">{job.location.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Experience</p>
              <p className="text-sm text-gray-900">{job.experienceYear ? `${job.experienceYear} years` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p className="text-sm text-gray-900">{job.creator?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-sm text-gray-900">{formatDate(job.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm text-gray-900">{job.status}</p>
            </div>
          </div>
          
          {/* Matching Score Weights */}
          {hasWeightScores && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Matching Score Weights</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50 p-4 rounded-lg">
                {job.maxScoreRoleJob !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreRoleJob}
                    </div>
                    <span className="text-sm">Job Title</span>
                  </div>
                )}
                {job.maxScoreExperienceYears !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreExperienceYears}
                    </div>
                    <span className="text-sm">Experience</span>
                  </div>
                )}
                {job.maxScoreProgrammingLanguage !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreProgrammingLanguage}
                    </div>
                    <span className="text-sm">Programming</span>
                  </div>
                )}
                {job.maxScoreKeyResponsibilities !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreKeyResponsibilities}
                    </div>
                    <span className="text-sm">Responsibilities</span>
                  </div>
                )}
                {job.maxScoreCertificate !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreCertificate}
                    </div>
                    <span className="text-sm">Certificates</span>
                  </div>
                )}
                {job.maxScoreLanguage !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreLanguage}
                    </div>
                    <span className="text-sm">Languages</span>
                  </div>
                )}
                {job.maxScoreSoftSkill !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreSoftSkill}
                    </div>
                    <span className="text-sm">Soft Skills</span>
                  </div>
                )}
                {job.maxScoreTechnicalSkill !== undefined && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">
                      {job.maxScoreTechnicalSkill}
                    </div>
                    <span className="text-sm">Technical</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p>Total weight score: {calculateTotalWeight()} points</p>
                <p>These weights represent the relative importance of each criterion when calculating candidate match scores.</p>
              </div>
            </div>
          )}
          
          {job.mustHave && (
            <div>
              <p className="text-sm font-medium text-gray-500">Must Have</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.mustHave}</p>
            </div>
          )}
          
          {job.niceToHave && (
            <div>
              <p className="text-sm font-medium text-gray-500">Nice to Have</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.niceToHave}</p>
            </div>
          )}
          
          {job.languageSkills && (
            <div>
              <p className="text-sm font-medium text-gray-500">Language Skills</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.languageSkills}</p>
            </div>
          )}
          
          {job.keyResponsibility && (
            <div>
              <p className="text-sm font-medium text-gray-500">Key Responsibilities</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.keyResponsibility}</p>
            </div>
          )}
          
          {job.ourOffer && (
            <div>
              <p className="text-sm font-medium text-gray-500">Our Offer</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{job.ourOffer}</p>
            </div>
          )}

          {job.status === 'pending' && onApprove && onReject && (
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => onReject(job.id)}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(job.id)}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal; 