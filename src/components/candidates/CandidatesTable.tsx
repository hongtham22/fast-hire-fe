import { CandidateData } from '@/types';
import CandidateCard from './CandidateCard';

interface CandidatesTableProps {
  candidates: CandidateData[];
  onViewHistory: (candidate: CandidateData) => void;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ candidates, onViewHistory }) => {
  return (
    <div className="rounded-xl border shadow-sm">
      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600">
        <div className="">Candidate Info</div>
        <div>Key Skills</div>
        <div>Experience</div>
        <div>Languages</div>
        <div>Latest Application</div>
        <div>Total Applications</div>
        <div>Actions</div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y">
        {candidates.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No candidates match your search criteria
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate} 
              onViewHistory={onViewHistory}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CandidatesTable; 