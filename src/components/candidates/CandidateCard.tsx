import { History, Clock, Award, Mail, Phone, Building2 } from "lucide-react";
import { CandidateData } from '@/types';
import { formatDate } from "@/lib/utils";

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
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-start hover:bg-gray-50 group">
      {/* Candidate Info */}
      <div className="col-span-2">
        <div className="font-medium text-gray-900">{candidate.name}</div>
        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
          <Mail className="h-3 w-3" />
          {candidate.email}
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {candidate.phone}
        </div>
        {candidate.latest_company && (
          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Building2 className="h-3 w-3" />
            {candidate.latest_company}
          </div>
        )}
      </div>
      
      {/* Key Skills */}
      <div className="col-span-2">
        <div className="flex flex-wrap gap-1">
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
            <span className="text-xs text-gray-500">No skills listed</span>
          )}
        </div>
      </div>
      
      {/* Experience */}
      <div className="col-span-1 text-gray-600 flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {candidate.experience_years ? (
          <span className="font-medium">{candidate.experience_years} years</span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>
      
      {/* Languages */}
      <div className="col-span-2">
        <div className="flex flex-col gap-1">
          {candidate.languages && candidate.languages.length > 0 ? (
            candidate.languages.map((lang, index) => (
              <span key={index} className="text-sm">
                {lang.language}:{" "}
                <span className="font-medium">{lang.level}</span>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No languages listed</span>
          )}
        </div>
      </div>
      
      {/* Latest Application */}
      <div className="col-span-3">
        <div className="font-medium text-gray-900">{candidate.latestApplication.jobTitle}</div>
        <div className="text-sm text-gray-500 mt-1">{formatDate(candidate.latestApplication.submittedAt)}</div>
        <div className="flex items-center gap-2 mt-2">
          <span 
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(candidate.latestApplication.status)}`}
          >
            {getStatusText(candidate.latestApplication.status)}
          </span>
          {candidate.latestApplication.matchingScore && (
            <span className="text-sm text-gray-700 flex items-center gap-1 font-medium">
              <Award className="h-4 w-4 text-orange-500" />
              {Math.round(candidate.latestApplication.matchingScore)}% match
            </span>
          )}
        </div>
      </div>
      
      {/* Total Applications */}
      <div className="col-span-1 flex items-start">
        <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {candidate.totalApplications}
        </div>
      </div>
      
      {/* Actions */}
      <div className="col-span-1 flex items-start">
        <button 
          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 
                     hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 
                     flex items-center gap-1.5 transition-all duration-200
                     shadow-sm hover:shadow group-hover:border-gray-400"
          onClick={() => onViewHistory(candidate)}
        >
          <History className="h-3.5 w-3.5" />
          History
        </button>
      </div>
    </div>
  );
};

export default CandidateCard; 