export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface CreateLeadBody {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadBody {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  [key: string]: string | undefined; // satisfies Express ParsedQs constraint
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
