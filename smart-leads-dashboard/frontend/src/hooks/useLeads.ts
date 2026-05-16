import { useQuery } from '@tanstack/react-query';
import { getLeadsApi } from '../api/lead.api';
import { Lead, LeadFilters, PaginationMeta } from '../types/lead.types';

// ── Return type for the hook ─────────────────────────────────────────────────
interface UseLeadsResult {
  leads: Lead[];
  pagination: PaginationMeta | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Default pagination meta to avoid undefined checks in components
const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

/**
 * useLeads — TanStack Query hook for fetching paginated leads.
 *
 * The entire `filters` object is used as part of the query key so the query
 * automatically refetches whenever any filter value changes.
 *
 * @param filters Current filter and pagination state
 */
export const useLeads = (filters: LeadFilters): UseLeadsResult => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    // Query key includes all filters — changes trigger automatic refetch
    queryKey: ['leads', filters],
    queryFn: () => getLeadsApi(filters),
    // Keep previous data while fetching new page to prevent empty flicker
    placeholderData: (previousData) => previousData,
    // Re-fetch if the window regains focus (good for multi-tab use)
    refetchOnWindowFocus: true,
    // Cache for 30 seconds before going stale
    staleTime: 30_000,
  });

  return {
    leads: data?.leads ?? [],
    pagination: data?.pagination ?? DEFAULT_PAGINATION,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
