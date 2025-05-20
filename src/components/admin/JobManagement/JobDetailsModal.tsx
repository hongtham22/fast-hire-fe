import { X } from 'lucide-react';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  matchingScore: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  resumeUrl: string;
}

interface JobDetails {
  id: string;
  jobTitle: string;
  location: {
    id: string;
    name: string;
  };
  experienceYear: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';
  createdAt: string;
  expireDate?: string;
  mustHave: string;
  niceToHave: string;
  languageSkills: string;
  keyResponsibility: string;
  ourOffer: string;
  applications: Application[];
}

interface JobDetailsModalProps {
  job: JobDetails | null;
  onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  if (!job) return null;

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Job Details</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Job Title</label>
                  <p className="mt-1 text-sm text-gray-900">{job.jobTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{job.location?.name || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Experience Required</label>
                  <p className="mt-1 text-sm text-gray-900">{job.experienceYear} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{job.status}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{job.createdAt}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Expire Date</label>
                  <p className="mt-1 text-sm text-gray-900">{job.expireDate || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Applications</label>
                  <p className="mt-1 text-sm text-gray-900">{job.applications?.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Requirements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Requirements</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Must Have Skills</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{job.mustHave}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nice to Have Skills</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{job.niceToHave}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Key Responsibilities</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{job.keyResponsibility}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Our Offer</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{job.ourOffer}</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Applications</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matching Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {job.applications?.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.candidateName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.email}</div>
                        <div className="text-sm text-gray-500">{application.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.matchingScore}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.appliedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 