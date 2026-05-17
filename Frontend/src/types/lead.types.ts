export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string | { _id: string; name: string; email: string; role?: string };
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | '';
  source: LeadSource | '';
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

export interface LeadsApiResponse {
  success: boolean;
  message: string;
  data: Lead[];
  meta: PaginationMeta;
}
