import { Search } from "lucide-react";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-gray-500">View and manage all candidates in the system</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates..."
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
          />
        </div>
        <select className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm">
          <option>All departments</option>
          <option>Engineering</option>
          <option>Design</option>
          <option>Product</option>
          <option>Marketing</option>
        </select>
        <select className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm">
          <option>Sort by: Recent</option>
          <option>Sort by: Name</option>
          <option>Sort by: Rating</option>
        </select>
      </div>
      
      <div className="rounded-xl border shadow-sm">
        <div className="grid grid-cols-6 gap-4 border-b bg-gray-50 px-6 py-3 font-medium">
          <div className="col-span-2">Name</div>
          <div>Skills</div>
          <div>Rating</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        <div className="divide-y">
          {[
            { 
              id: 1, 
              name: "John Doe", 
              skills: ["React", "TypeScript", "Node.js"], 
              rating: 4.5, 
              status: "Active" 
            },
            { 
              id: 2, 
              name: "Jane Smith", 
              skills: ["UI/UX", "Figma", "Adobe XD"], 
              rating: 4.8, 
              status: "In Process" 
            },
            { 
              id: 3, 
              name: "Alex Johnson", 
              skills: ["AWS", "Docker", "Kubernetes"], 
              rating: 4.2, 
              status: "Active" 
            },
            { 
              id: 4, 
              name: "Maria Garcia", 
              skills: ["Agile", "Scrum", "Product Strategy"], 
              rating: 4.6, 
              status: "Active" 
            },
            { 
              id: 5, 
              name: "David Brown", 
              skills: ["Python", "Django", "PostgreSQL"], 
              rating: 4.3, 
              status: "Active" 
            },
          ].map((candidate) => (
            <div key={candidate.id} className="grid grid-cols-6 gap-4 px-6 py-4">
              <div className="col-span-2 font-medium">{candidate.name}</div>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-gray-600">{candidate.rating}/5</div>
              <div>
                <span 
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    candidate.status === "Active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {candidate.status}
                </span>
              </div>
              <div className="space-x-2">
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  View
                </button>
                <button className="rounded border px-2 py-1 text-xs font-medium hover:bg-gray-50">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 