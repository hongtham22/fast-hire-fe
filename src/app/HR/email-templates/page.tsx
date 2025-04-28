import { Plus, Edit, Trash, Mail } from "lucide-react";

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Templates</h1>
          <p className="text-gray-500">Manage templates for communication with candidates</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            id: 1,
            title: "Application Received",
            description: "Confirmation email sent after receiving an application",
            lastModified: "3 days ago",
            category: "Automatic",
          },
          {
            id: 2,
            title: "Interview Invitation",
            description: "Invitation for an interview with schedule details",
            lastModified: "1 week ago",
            category: "Manual",
          },
          {
            id: 3,
            title: "Application Rejected",
            description: "Rejection notice for applicants that don't match criteria",
            lastModified: "2 weeks ago",
            category: "Automatic",
          },
          {
            id: 4,
            title: "Second Interview",
            description: "Invitation for a second round of interviews",
            lastModified: "3 weeks ago",
            category: "Manual",
          },
          {
            id: 5,
            title: "Job Offer",
            description: "Official job offer with position and salary details",
            lastModified: "1 month ago",
            category: "Manual",
          },
        ].map((template) => (
          <div key={template.id} className="rounded-xl border p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">{template.title}</h3>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button className="rounded-full p-1 hover:bg-gray-100">
                  <Trash className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">{template.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                template.category === "Automatic" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {template.category}
              </span>
              <span className="text-xs text-gray-500">Modified {template.lastModified}</span>
            </div>
            <button className="mt-4 w-full rounded-md border border-blue-600 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 