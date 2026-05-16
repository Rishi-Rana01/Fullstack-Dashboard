import axiosInstance from './axios.instance';
import { Lead, LeadFilters, LeadFormData, LeadListData } from '../types/lead.types';

// ── API Response Wrappers ───────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * GET /leads
 * Fetches paginated leads with the given filters applied.
 * TanStack Query will call this with the current filter state as the key.
 */
export const getLeadsApi = async (filters: LeadFilters): Promise<LeadListData> => {
  const params: Record<string, string | number> = {
    page: filters.page,
    sort: filters.sort,
  };

  // Only include filter params that have actual values
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search.trim()) params.search = filters.search.trim();

  const response = await axiosInstance.get<ApiResponse<LeadListData>>('/leads', { params });
  return response.data.data;
};

/**
 * GET /leads/:id
 * Fetches a single lead by ID.
 */
export const getLeadByIdApi = async (id: string): Promise<Lead> => {
  const response = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
  return response.data.data;
};

/**
 * POST /leads
 * Creates a new lead.
 */
export const createLeadApi = async (data: LeadFormData): Promise<Lead> => {
  const response = await axiosInstance.post<ApiResponse<Lead>>('/leads', data);
  return response.data.data;
};

/**
 * PUT /leads/:id
 * Updates an existing lead. Accepts a partial payload.
 */
export const updateLeadApi = async (
  id: string,
  data: Partial<LeadFormData>
): Promise<Lead> => {
  const response = await axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, data);
  return response.data.data;
};

/**
 * DELETE /leads/:id
 * Deletes a lead. Admin only — enforced on the backend.
 */
export const deleteLeadApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/leads/${id}`);
};

/**
 * GET /leads/export/csv
 * Returns raw CSV data for the given filters. Admin only.
 * Uses responseType: 'blob' to handle binary/text file download.
 */
export const exportLeadsCsvApi = async (
  filters: Omit<LeadFilters, 'page' | 'sort'>
): Promise<Blob> => {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search.trim()) params.search = filters.search.trim();

  const response = await axiosInstance.get('/leads/export/csv', {
    params,
    responseType: 'blob', // Receive raw bytes, not JSON
  });
  return response.data as Blob;
};
