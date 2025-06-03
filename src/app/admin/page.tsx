"use client";

import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  TrendingUp,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import StatCard from '@/components/admin/Dashboard/StatCard';
import RecentApplications from '@/components/admin/Dashboard/RecentApplications';
import ApplicationsChart from '@/components/admin/Dashboard/Charts/ApplicationsChart';
import JobMatchingScoreChart from '@/components/admin/Dashboard/Charts/JobMatchingScoreChart';
import JobMatchingBreakdownChart from '@/components/admin/Dashboard/Charts/JobMatchingBreakdownChart';
import { getDashboardData } from '@/lib/api';
import { DashboardData, JobMatchingScore, RecentApplication } from '@/types';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChartView, setActiveChartView] = useState<'overview' | 'breakdown'>('overview');
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async (isRetry = false) => {
    try {
      setLoading(true);
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      }
      
      const result = await getDashboardData();
      
      if (result.error) {
        console.error('Dashboard API error:', result.error);
        setDashboardData(null);
      } else if (result.data) {
        setDashboardData(result.data);
        setRetryCount(0);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">Retry attempt: {retryCount}</p>
          )}
        </div>
      </div>
    );
  }

  // If error or no data, still render the dashboard with fallback data
  const { stats, recentApplications, applicationsChart, jobMatchingScores } = dashboardData || {
    stats: { totalCandidates: 0, totalJobs: 0, totalHR: 0, averageMatchingScore: 0 },
    recentApplications: [],
    applicationsChart: null,
    jobMatchingScores: []
  };

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

  // Validate chart data and provide fallback
  const hasValidApplicationsChart = applicationsChart && 
    applicationsChart.labels && 
    Array.isArray(applicationsChart.labels) && 
    applicationsChart.datasets && 
    Array.isArray(applicationsChart.datasets) && 
    applicationsChart.datasets.length > 0;

  const fallbackApplicationsChart = {
    labels: ['No Data'],
    datasets: [{
      label: 'Applications',
      data: [0],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  };

  // Validate job matching scores data
  const hasValidJobMatchingScores = jobMatchingScores && 
    Array.isArray(jobMatchingScores) && 
    jobMatchingScores.length > 0;

  const fallbackJobMatchingScores: JobMatchingScore[] = [];

  // Validate recent applications data
  const hasValidRecentApplications = recentApplications && 
    Array.isArray(recentApplications);

  const fallbackRecentApplications: RecentApplication[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
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
        <ApplicationsChart data={hasValidApplicationsChart ? applicationsChart : fallbackApplicationsChart} />
        
        {/* Job Matching Charts with Toggle */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Job Matching Analysis</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveChartView('overview')}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeChartView === 'overview' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Overview
              </button>
              <button
                onClick={() => setActiveChartView('breakdown')}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeChartView === 'breakdown' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PieChart className="w-4 h-4 mr-1" />
                Distribution
              </button>
            </div>
          </div>
          
          <div className="p-2">
            {activeChartView === 'overview' ? (
              <JobMatchingScoreChart jobMatchingScores={hasValidJobMatchingScores ? jobMatchingScores : fallbackJobMatchingScores} />
            ) : (
              <JobMatchingBreakdownChart jobMatchingScores={hasValidJobMatchingScores ? jobMatchingScores : fallbackJobMatchingScores} />
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <RecentApplications applications={hasValidRecentApplications ? recentApplications : fallbackRecentApplications} />
    </div>
  );
} 