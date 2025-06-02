import { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import { CandidateData } from '@/types';
import { ApplicationHistory } from './useCandidates';

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
      return 'bg-blue-100 text-blue-700';
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
      return 'Pending';
  }
};

interface ApplicationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateData | null;
  fetchApplicationHistory: (candidateId: string) => Promise<ApplicationHistory[]>;
  onError: (error: string) => void;
}

const ApplicationHistoryModal: React.FC<ApplicationHistoryModalProps> = ({
  isOpen,
  onClose,
  candidate,
  fetchApplicationHistory,
  onError,
}) => {
  const [applicationHistory, setApplicationHistory] = useState<ApplicationHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidate) {
      loadApplicationHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, candidate]);

  const loadApplicationHistory = async () => {
    if (!candidate) return;
    
    setLoading(true);
    try {
      const history = await fetchApplicationHistory(candidate.id);
      // Sort by submittedAt date in descending order (newest first)
      const sortedHistory = history.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setApplicationHistory(sortedHistory);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to fetch application history');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApplicationHistory([]);
    onClose();
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Application History</h2>
            <p className="text-gray-600">{candidate.name} - {candidate.email}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="text-center py-8">Loading application history...</div>
          ) : applicationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No application history found</div>
          ) : (
            <div className="space-y-4">
              {applicationHistory.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{app.job.jobTitle}</h3>
                      <p className="text-sm text-gray-600">Applied on: {formatDate(app.submittedAt)}</p>
                      {app.matchingScore && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Award className="h-3 w-3" />
                          Match score: {Math.round(app.matchingScore)}%
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span 
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(app.status)}`}
                      >
                        {getStatusText(app.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationHistoryModal; 