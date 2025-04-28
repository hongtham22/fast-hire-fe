import Link from "next/link";
import { FileText, User, FolderOpen, Mail } from "lucide-react";

type DashboardCardProps = {
  title: string;
  count: number;
  href: string;
  icon: React.ReactNode;
  color: string;
};

const DashboardCard = ({ title, count, href, icon, color }: DashboardCardProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`rounded-full ${color} p-2 w-fit`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-1 text-3xl font-bold">{count}</p>
    </Link>
  );
};

export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-gray-500">Welcome to FastHire HR management system</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Jobs"
          count={12}
          href="/HR/job-postings"
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Candidates"
          count={87}
          href="/HR/candidates"
          icon={<User className="h-5 w-5 text-green-500" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="New Applications"
          count={23}
          href="/HR/applications"
          icon={<FolderOpen className="h-5 w-5 text-orange-500" />}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Email Templates"
          count={5}
          href="/HR/email-templates"
          icon={<Mail className="h-5 w-5 text-purple-500" />}
          color="bg-purple-100"
        />
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Recent Applications</h3>
          <div className="mt-4 space-y-3">
            {[
              { name: "John Doe", position: "Frontend Developer", date: "2 hours ago" },
              { name: "Jane Smith", position: "UX Designer", date: "5 hours ago" },
              { name: "David Brown", position: "Backend Developer", date: "1 day ago" },
              { name: "Emily Chen", position: "Project Manager", date: "2 days ago" },
            ].map((application, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{application.name}</p>
                  <p className="text-sm text-gray-500">{application.position}</p>
                </div>
                <span className="text-xs text-gray-500">{application.date}</span>
              </div>
            ))}
          </div>
          <Link href="/HR/applications" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            View all applications
          </Link>
        </div>
        
        <div className="rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-medium">Upcoming Interviews</h3>
          <div className="mt-4 space-y-3">
            {[
              { candidate: "Alex Johnson", position: "Senior Developer", date: "Today, 2:00 PM" },
              { candidate: "Maria Garcia", position: "Product Manager", date: "Tomorrow, 10:00 AM" },
              { candidate: "Robert Wilson", position: "Data Analyst", date: "Jan 15, 11:30 AM" },
              { candidate: "Sarah Lee", position: "DevOps Engineer", date: "Jan 16, 3:00 PM" },
            ].map((interview, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{interview.candidate}</p>
                  <p className="text-sm text-gray-500">{interview.position}</p>
                </div>
                <span className="text-xs text-gray-500">{interview.date}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-600 hover:underline">
            Schedule new interview
          </button>
        </div>
      </div>
    </div>
  );
}
