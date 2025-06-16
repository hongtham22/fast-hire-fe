import { Search } from 'lucide-react';
import { HRUser } from '@/types';

interface AdminCandidateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedHrId: string;
  onHrChange: (hrId: string) => void;
  hrUsers: HRUser[];
}

export default function AdminCandidateFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedHrId,
  onHrChange,
  hrUsers
}: AdminCandidateFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search candidates by name, email, or job..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* HR Filter */}
      <div className="sm:w-48">
        <select
          value={selectedHrId}
          onChange={(e) => onHrChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All HR Users</option>
          {hrUsers.map((hr) => (
            <option key={hr.id} value={hr.id}>
              {hr.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="sm:w-48">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="recent">Most Recent</option>
          <option value="name">Name (A-Z)</option>
          <option value="applications">Application Count</option>
          <option value="score">Match Score</option>
        </select>
      </div>
    </div>
  );
} 