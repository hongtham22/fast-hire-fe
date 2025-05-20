"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  TrendingUp,
} from 'lucide-react';
import StatCard from '@/components/admin/Dashboard/StatCard';
import RecentApplications from '@/components/admin/Dashboard/RecentApplications';
import ApplicationsChart from '@/components/admin/Dashboard/Charts/ApplicationsChart';
import MatchingScoreChart from '@/components/admin/Dashboard/Charts/MatchingScoreChart';

interface DashboardStats {
  totalCandidates: number;
  totalJobs: number;
  totalHR: number;
  averageMatchingScore: number;
  recentApplications: {
    id: string;
    candidateName: string;
    jobTitle: string;
    matchingScore: number;
    appliedAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    totalJobs: 0,
    totalHR: 0,
    averageMatchingScore: 0,
    recentApplications: []
  });

  // Mock data for charts
  const applicationsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const matchingScoreData = {
    labels: ['High (>80%)', 'Medium (60-80%)', 'Low (<60%)'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 206, 86)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    // TODO: Fetch actual data from API
    // This is mock data for now
    setStats({
      totalCandidates: 150,
      totalJobs: 25,
      totalHR: 8,
      averageMatchingScore: 75,
      recentApplications: [
        {
          id: '1',
          candidateName: 'John Doe',
          jobTitle: 'Senior Software Engineer',
          matchingScore: 85,
          appliedAt: '2024-03-20'
        },
        {
          id: '2',
          candidateName: 'Jane Smith',
          jobTitle: 'Product Manager',
          matchingScore: 92,
          appliedAt: '2024-03-19'
        }
      ]
    });
  }, []);

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-green-500'
    },
    {
      title: 'HR Team Members',
      value: stats.totalHR,
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg. Matching Score',
      value: `${stats.averageMatchingScore}%`,
      icon: TrendingUp,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {/* <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Export Report
          </button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ApplicationsChart data={applicationsData} />
        <MatchingScoreChart data={matchingScoreData} />
      </div>

      {/* Recent Applications */}
      <RecentApplications applications={stats.recentApplications} />
    </div>
  );
} 