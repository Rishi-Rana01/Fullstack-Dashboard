// ── Frontend Lead Types ────────────────────────────────────────────────────
// Mirror of backend/src/types/lead.types.ts — kept in sync manually.
// Dates are strings here since JSON serialization converts Dates to ISO strings.

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LeadFilters {
  status: LeadStatus | '';
  source: LeadSource | '';
  search: string;
  sort: 'latest' | 'oldest';
  page: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadListData {
  leads: Lead[];
  pagination: PaginationMeta;
}

// Zod-validated form data for creating/editing a lead
export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}
