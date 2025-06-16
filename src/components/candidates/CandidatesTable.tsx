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
      <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600">
        <div className="col-span-2">Candidate Info</div>
        <div className="col-span-2">Key Skills</div>
        <div className="col-span-1">Experience</div>
        <div className="col-span-2">Languages</div>
        <div className="col-span-3">Latest Application</div>
        <div className="col-span-1">Total</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y">
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidatesTable; 