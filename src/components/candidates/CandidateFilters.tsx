import { Search } from "lucide-react";

interface CandidateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CandidateFilters: React.FC<CandidateFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, skills..."
          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select 
        className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="recent">Sort by: Recent</option>
        <option value="name">Sort by: Name</option>
        <option value="experience">Sort by: Experience</option>
        <option value="applications">Sort by: Applications</option>
      </select>
    </div>
  );
};

export default CandidateFilters; 