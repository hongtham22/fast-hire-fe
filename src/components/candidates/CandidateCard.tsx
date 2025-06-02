import { History, MapPin, Clock, Award } from "lucide-react";
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
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'pending':
    default:
      return 'bg-orange-100 text-orange-700';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    case 'pending':
    default:
      return 'Not Evaluated';
  }
};

interface CandidateCardProps {
  candidate: CandidateData;
  onViewHistory: (candidate: CandidateData) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewHistory }) => {
  return (
    <div className="grid grid-cols-7 gap-4 px-6 py-4 items-start">
      {/* Candidate Info */}
      <div className="">
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
      <div>
        <div className="flex flex-wrap max-w-[180px] gap-1 mt-1">
          {candidate.technical_skills && candidate.technical_skills.length > 0 ? (
            candidate.technical_skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No data</span>
          )}
        </div>
      </div>
      
      {/* Experience */}
      <div className="text-gray-600 flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {candidate.experience_years ? `${candidate.experience_years} years` : 'N/A'}
      </div>
      
      {/* Languages */}
      <div className="text-gray-700">
        <div className="flex flex-col gap-1">
          {candidate.languages && candidate.languages.length > 0 ? (
            candidate.languages.map((lang, index) => (
              <span key={index} className="text-xs">
                {lang.language}:{" "}
                <span className="font-medium">{lang.level}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No data</span>
          )}
        </div>
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
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Award className="h-4 w-4" />
              {Math.round(candidate.latestApplication.matchingScore)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Total Applications */}
      <div className="flex items-start gap-2">
        <div className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">
          {candidate.totalApplications}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-start gap-2">
        <button 
          className="rounded border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-1 min-w-0"
          onClick={() => onViewHistory(candidate)}
        >
          <History className="h-4 w-4 flex-shrink-0" />
         View History
        </button>
      </div>
    </div>
  );
};

export default CandidateCard; 