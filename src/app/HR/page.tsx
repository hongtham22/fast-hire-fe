"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, User, FolderOpen, Mail, TrendingUp, Plus, Calendar, AlertTriangle, BarChart3 } from "lucide-react";
import { getCandidatesForHR, getJobsForHR, getEmailTemplates } from "@/lib/api";

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
      className="group flex flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      <div className={`rounded-lg ${color} p-2 w-fit group-hover:scale-105 transition-transform duration-200`}>
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
    </Link>
  );
};

interface DashboardStats {
  activeJobs: number;
  candidates: number;
  newApplications: number;
  emailTemplates: number;
}

interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  submittedAt: string;
  matchingScore: number | null;
}

interface RecentApplicant {
  id: string;
  name: string;
  email: string;
  latestJob: string;
  submittedAt: string;
  matchingScore: number | null;
}

interface ExpiringJob {
  id: string;
  jobTitle: string;
  expireDate: string;
  daysLeft: number;
}

interface MatchScoreStats {
  high: number;
  medium: number;
  low: number;
  noScore: number;
}

export default function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    candidates: 0,
    newApplications: 0,
    emailTemplates: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<RecentApplicant[]>([]);
  const [expiringJobs, setExpiringJobs] = useState<ExpiringJob[]>([]);
  const [matchScoreStats, setMatchScoreStats] = useState<MatchScoreStats>({
    high: 0,
    medium: 0,
    low: 0,
    noScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [jobsResponse, candidatesResponse, templatesResponse] = await Promise.all([
          getJobsForHR({ status: 'approved', limit: 100 }),
          getCandidatesForHR(),
          getEmailTemplates()
        ]);

        const jobs = jobsResponse.data?.jobs || [];
        const candidates = candidatesResponse.data || [];
        const templates = templatesResponse.data || [];

        const activeJobs = jobs.length;
        const candidatesCount = candidates.length;
        const totalApplications = candidates.reduce((sum, candidate) => sum + candidate.totalApplications, 0);

        setStats({
          activeJobs,
          candidates: candidatesCount,
          newApplications: totalApplications,
          emailTemplates: templates.length,
        });

        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const expiring = jobs
          .filter(job => {
            if (!job.expireDate) return false;
            const expireDate = new Date(job.expireDate);
            return expireDate >= now && expireDate <= sevenDaysFromNow;
          })
          .map(job => {
            const expireDate = new Date(job.expireDate!);
            const daysLeft = Math.ceil((expireDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
            return {
              id: job.id,
              jobTitle: job.jobTitle,
              expireDate: job.expireDate!,
              daysLeft
            };
          })
          .sort((a, b) => a.daysLeft - b.daysLeft);

        setExpiringJobs(expiring);

        const allApplications: RecentApplication[] = [];
        candidates.forEach(candidate => {
          candidate.applications.forEach(app => {
            allApplications.push({
              id: app.id,
              candidateName: candidate.name,
              jobTitle: app.jobTitle,
              submittedAt: app.submittedAt,
              matchingScore: app.matchingScore,
            });
          });
        });

        const sortedApplications = allApplications
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 5);

        setRecentApplications(sortedApplications);

        let high = 0, medium = 0, low = 0, noScore = 0;
        allApplications.forEach(app => {
          if (app.matchingScore === null) {
            noScore++;
          } else if (app.matchingScore >= 80) {
            high++;
          } else if (app.matchingScore >= 60) {
            medium++;
          } else {
            low++;
          }
        });

        setMatchScoreStats({ high, medium, low, noScore });

        const sortedApplicants = candidates
          .map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            latestJob: candidate.latestApplication.jobTitle,
            submittedAt: candidate.latestApplication.submittedAt,
            matchingScore: candidate.latestApplication.matchingScore,
          }))
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
          .slice(0, 5);

        setRecentApplicants(sortedApplicants);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  const getMatchScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border p-6 shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-gray-500">Welcome to FastHire HR management system</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Jobs"
          count={stats.activeJobs}
          href="/HR/job-postings"
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Candidates"
          count={stats.candidates}
          href="/HR/candidates"
          icon={<User className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="Total Applications"
          count={stats.newApplications}
          href="/HR/applications"
          icon={<FolderOpen className="h-6 w-6 text-orange-600" />}
          color="bg-orange-100"
        />
        <DashboardCard
          title="Email Templates"
          count={stats.emailTemplates}
          href="/HR/email-templates"
          icon={<Mail className="h-6 w-6 text-purple-600" />}
          color="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <Plus className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
          <Link
              href="/HR/job-postings"
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Job Postings</p>
                <p className="text-sm text-gray-600">Manage job postings</p>
              </div>
            </Link>
         
            <Link
              href="/HR/email-templates"
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Email Templates</p>
                <p className="text-sm text-gray-600">Manage communication templates</p>
              </div>
            </Link>
            <Link
              href="/HR/candidates"
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Review Candidates</p>
                <p className="text-sm text-gray-600">Browse candidate profiles</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Jobs Expiring Soon</h3>
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div className="space-y-3">
            {expiringJobs.length === 0 ? (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No jobs expiring soon</p>
              </div>
            ) : (
              expiringJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{job.jobTitle}</p>
                    <p className="text-xs text-gray-600">
                      {job.daysLeft === 0 ? 'Expires today' : `${job.daysLeft} days left`}
                    </p>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
              ))
            )}
            {expiringJobs.length > 3 && (
              <Link href="/HR/job-postings" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View all ({expiringJobs.length}) →
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Match Score Distribution</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">High (80%+)</span>
              </div>
              <span className="font-medium text-gray-900">{matchScoreStats.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">Medium (60-79%)</span>
              </div>
              <span className="font-medium text-gray-900">{matchScoreStats.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-700">Low (60%-)</span>
              </div>
              <span className="font-medium text-gray-900">{matchScoreStats.low}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-700">Not scored</span>
              </div>
              <span className="font-medium text-gray-900">{matchScoreStats.noScore}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            {recentApplications.length === 0 ? (
              <div className="text-center py-6">
                <FolderOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No applications yet</p>
              </div>
            ) : (
              recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{application.candidateName}</p>
                    <p className="text-sm text-gray-600">{application.jobTitle}</p>
                    {application.matchingScore && (
                      <p className={`text-xs font-medium ${getMatchScoreColor(application.matchingScore)}`}>
                        Match: {application.matchingScore}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{formatTimeAgo(application.submittedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/HR/job-postings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all applications →
            </Link>
          </div>
        </div>
        
        <div className="rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Applicants</h3>
            <User className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-3">
            {recentApplicants.length === 0 ? (
              <div className="text-center py-6">
                <User className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No applicants yet</p>
              </div>
            ) : (
              recentApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{applicant.name}</p>
                    <p className="text-sm text-gray-600">{applicant.latestJob}</p>
                    {applicant.matchingScore && (
                      <p className={`text-xs font-medium ${getMatchScoreColor(applicant.matchingScore)}`}>
                        Match: {applicant.matchingScore}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{formatTimeAgo(applicant.submittedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/HR/candidates" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all candidates →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
} 