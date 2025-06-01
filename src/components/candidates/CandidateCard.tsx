import { History, Mail, MapPin, Clock, Award } from "lucide-react";
import { CandidateData } from '@/types';

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'hired':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'pending':
    default:
      return 'bg-blue-100 text-blue-700';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'hired':
      return 'Hired';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Pending';
  }
};

interface CandidateCardProps {
  candidate: CandidateData;
  onViewHistory: (candidate: CandidateData) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewHistory }) => {
  return (
    <div className="grid grid-cols-7 gap-4 px-6 py-4">
      {/* Candidate Info */}
      <div className="col-span-2">
        <div className="font-medium">{candidate.name}</div>
        <div className="text-sm text-gray-600">{candidate.email}</div>
        <div className="text-sm text-gray-600">{candidate.phone}</div>
        {candidate.latest_company && (
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {candidate.latest_company}
          </div>
        )}
      </div>
      
      {/* Key Skills */}
      <div className="flex flex-wrap gap-1">
        {[...candidate.skills, ...candidate.technical_skills].slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
          >
            {skill}
          </span>
        ))}
        {[...candidate.skills, ...candidate.technical_skills].length > 4 && (
          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            +{[...candidate.skills, ...candidate.technical_skills].length - 4}
          </span>
        )}
      </div>
      
      {/* Experience */}
      <div className="text-gray-600 flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {candidate.experience_years ? `${candidate.experience_years} years` : 'N/A'}
      </div>
      
      {/* Latest Application */}
      <div>
        <div className="font-medium text-sm">{candidate.latestApplication.jobTitle}</div>
        <div className="text-xs text-gray-500">{formatDate(candidate.latestApplication.submittedAt)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span 
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(candidate.latestApplication.status)}`}
          >
            {getStatusText(candidate.latestApplication.status)}
          </span>
          {candidate.latestApplication.matchingScore && (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Award className="h-3 w-3" />
              {Math.round(candidate.latestApplication.matchingScore)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Total Applications */}
      <div className="text-center">
        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
          {candidate.totalApplications}
        </span>
      </div>
      
      {/* Actions */}
      <div className="flex items-start gap-2">
        <button 
          className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-1 min-w-0"
          onClick={() => onViewHistory(candidate)}
        >
          <History className="h-3 w-3 flex-shrink-0" />
          History
        </button>
        <button className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-1 min-w-0">
          <Mail className="h-3 w-3 flex-shrink-0" />
          Contact
        </button>
      </div>
    </div>
  );
};

export default CandidateCard; 