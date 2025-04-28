import { Search, Filter } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-gray-500">Review and process job applications</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>
      
      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-7 gap-4 border-b bg-gray-50 px-6 py-3 font-medium">
          <div className="col-span-2">Candidate</div>
          <div>Position</div>
          <div>Match Score</div>
          <div>Date Applied</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        <div className="divide-y">
          {[
            { 
              id: 1, 
              candidate: "John Doe", 
              position: "Senior Frontend Developer", 
              matchScore: 92, 
              dateApplied: "Jun 10, 2023", 
              status: "New" 
            },
            { 
              id: 2, 
              candidate: "Jane Smith", 
              position: "UX Designer", 
              matchScore: 85, 
              dateApplied: "Jun 12, 2023", 
              status: "In Review" 
            },
            { 
              id: 3, 
              candidate: "Alex Johnson", 
              position: "DevOps Engineer", 
              matchScore: 78, 
              dateApplied: "Jun 15, 2023", 
              status: "New" 
            },
            { 
              id: 4, 
              candidate: "Maria Garcia", 
              position: "Product Manager", 
              matchScore: 88, 
              dateApplied: "Jun 18, 2023", 
              status: "Interview" 
            },
            { 
              id: 5, 
              candidate: "David Brown", 
              position: "Backend Developer", 
              matchScore: 90, 
              dateApplied: "Jun 20, 2023", 
              status: "New" 
            },
          ].map((application) => (
            <div key={application.id} className="grid grid-cols-7 gap-4 px-6 py-4">
              <div className="col-span-2 font-medium">{application.candidate}</div>
              <div className="text-gray-600">{application.position}</div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  application.matchScore >= 90 
                    ? "bg-green-100 text-green-700" 
                    : application.matchScore >= 80 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-yellow-100 text-yellow-700"
                }`}>
                  {application.matchScore}%
                </span>
              </div>
              <div className="text-gray-600">{application.dateApplied}</div>
              <div>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  application.status === "New" 
                    ? "bg-purple-100 text-purple-700" 
                    : application.status === "In Review" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-orange-100 text-orange-700"
                }`}>
                  {application.status}
                </span>
              </div>
              <div className="space-x-2">
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  View
                </button>
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  Process
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 