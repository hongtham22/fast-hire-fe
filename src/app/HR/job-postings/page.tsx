import { Plus } from "lucide-react";

export default function JobPostingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-gray-500">Manage your active and closed job postings</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Job Posting
        </button>
      </div>
      
      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-6 gap-4 border-b bg-gray-50 px-6 py-3 font-medium">
          <div className="col-span-2">Position</div>
          <div>Department</div>
          <div>Applications</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        <div className="divide-y">
          {[
            { 
              id: 1, 
              position: "Senior Frontend Developer", 
              department: "Engineering", 
              applications: 18, 
              status: "Active" 
            },
            { 
              id: 2, 
              position: "UX Designer", 
              department: "Design", 
              applications: 24, 
              status: "Active" 
            },
            { 
              id: 3, 
              position: "DevOps Engineer", 
              department: "Infrastructure", 
              applications: 7, 
              status: "Active" 
            },
            { 
              id: 4, 
              position: "Product Manager", 
              department: "Product", 
              applications: 12, 
              status: "Active" 
            },
            { 
              id: 5, 
              position: "Backend Developer", 
              department: "Engineering", 
              applications: 15, 
              status: "Active" 
            },
          ].map((job) => (
            <div key={job.id} className="grid grid-cols-6 gap-4 px-6 py-4">
              <div className="col-span-2 font-medium">{job.position}</div>
              <div className="text-gray-600">{job.department}</div>
              <div className="text-gray-600">{job.applications}</div>
              <div>
                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  {job.status}
                </span>
              </div>
              <div className="space-x-2">
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  Edit
                </button>
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 