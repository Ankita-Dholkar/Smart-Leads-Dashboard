import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { LeadFilters } from '../../types/lead.types';

interface FiltersBarProps {
  filters: LeadFilters;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof Omit<LeadFilters, 'search' | 'page'>, value: string) => void;
  onReset: () => void;
}

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES = ['', 'Website', 'Instagram', 'Referral'];
const SORTS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const FiltersBar = ({ filters, onSearchChange, onFilterChange, onReset }: FiltersBarProps) => {
  const hasActiveFilters =
    filters.search || filters.status || filters.source || filters.sort !== 'latest';

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id="search-leads"
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input pl-9"
        />
        {filters.search && (
          <button
            id="clear-search"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:block" />

        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="form-select w-auto min-w-[130px]"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          id="filter-source"
          value={filters.source}
          onChange={(e) => onFilterChange('source', e.target.value)}
          className="form-select w-auto min-w-[130px]"
        >
          <option value="">All Sources</option>
          {SOURCES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="form-select w-auto min-w-[130px]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            id="reset-filters"
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
