import React, { useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus } from '../../types/lead.types';
import { useDebounce } from '../../hooks/useDebounce';

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
}

const STATUS_OPTIONS: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS: { value: LeadSource | ''; label: string }[] = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
] as const;

const selectClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors cursor-pointer';

/**
 * LeadFilters — search bar, status/source/sort dropdowns, and clear button.
 * Search is debounced internally (500ms) before triggering a re-fetch via onChange.
 */
export const LeadFiltersBar: React.FC<LeadFiltersProps> = ({
  filters,
  onChange,
}) => {
  // Track the raw (non-debounced) search value for controlled input display
  const [rawSearch, setRawSearch] = React.useState(filters.search);
  const debouncedSearch = useDebounce(rawSearch, 500);

  // Sync debounced search → parent filters (triggers API refetch)
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ ...filters, search: debouncedSearch, page: 1 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, status: e.target.value as LeadStatus | '', page: 1 });
    },
    [filters, onChange]
  );

  const handleSourceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, source: e.target.value as LeadSource | '', page: 1 });
    },
    [filters, onChange]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...filters, sort: e.target.value as 'latest' | 'oldest', page: 1 });
    },
    [filters, onChange]
  );

  const handleClear = useCallback(() => {
    setRawSearch('');
    onChange({
      status: '',
      source: '',
      search: '',
      sort: 'latest',
      page: 1,
    });
  }, [onChange]);

  const hasActiveFilters =
    filters.status !== '' ||
    filters.source !== '' ||
    filters.search !== '' ||
    filters.sort !== 'latest';

  return (
    <div className="card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <SlidersHorizontal size={16} className="text-brand-500" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors"
          >
            <X size={12} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filter controls — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className={selectClass}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Source filter */}
        <select
          value={filters.source}
          onChange={handleSourceChange}
          className={selectClass}
          aria-label="Filter by source"
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort order */}
        <select
          value={filters.sort}
          onChange={handleSortChange}
          className={selectClass}
          aria-label="Sort order"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
