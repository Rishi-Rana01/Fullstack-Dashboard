// ── Backend Lead Types ─────────────────────────────────────────────────────
// All lead-related TypeScript types used across backend controllers, models,
// and validators. Keep in sync with frontend/src/types/lead.types.ts.

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID reference
}

export interface CreateLeadDTO {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

// Allows partial updates — all fields are optional
export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {}

export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadListResponse {
  leads: ILead[];
  pagination: PaginationMeta;
}
