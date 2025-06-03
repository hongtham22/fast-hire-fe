export interface DashboardStats {
  totalCandidates: number;
  totalJobs: number;
  totalHR: number;
  averageMatchingScore: number;
}

export interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  matchingScore: number;
  appliedAt: string;
  status: string;
}

export interface JobMatchingScore {
  jobId: string;
  jobTitle: string;
  averageScore: number;
  applicationsCount: number;
  highScoreCount: number; // >80%
  mediumScoreCount: number; // 60-80%
  lowScoreCount: number; // <60%
}

// Recharts-compatible data structures
export interface ApplicationsChartData {
  name: string;
  applications: number;
}

export interface ApplicationsChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

export interface JobMatchingChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface DashboardData {
  stats: DashboardStats;
  recentApplications: RecentApplication[];
  applicationsChart: ApplicationsChart;
  jobMatchingScores: JobMatchingScore[];
} 