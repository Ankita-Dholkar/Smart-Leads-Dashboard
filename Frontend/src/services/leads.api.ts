import api from './api';
import type { Lead, LeadFormData, LeadFilters, LeadsApiResponse } from '../types/lead.types';

export const getLeads = async (filters: Partial<LeadFilters>): Promise<LeadsApiResponse> => {
  const params: Record<string, string | number> = {};
  if (filters.page) params['page'] = filters.page;
  if (filters.search) params['search'] = filters.search;
  if (filters.status) params['status'] = filters.status;
  if (filters.source) params['source'] = filters.source;
  if (filters.sort) params['sort'] = filters.sort;

  const res = await api.get<LeadsApiResponse>('/leads', { params });
  return res.data;
};

export const getLead = async (id: string): Promise<Lead> => {
  const res = await api.get<{ data: Lead }>(`/leads/${id}`);
  return res.data.data;
};

export const createLead = async (data: LeadFormData): Promise<Lead> => {
  const res = await api.post<{ data: Lead }>('/leads', data);
  return res.data.data;
};

export const updateLead = async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
  const res = await api.put<{ data: Lead }>(`/leads/${id}`, data);
  return res.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsCSV = async (filters: Partial<LeadFilters>): Promise<Blob> => {
  const params: Record<string, string | number> = {};
  if (filters.search) params['search'] = filters.search;
  if (filters.status) params['status'] = filters.status;
  if (filters.source) params['source'] = filters.source;

  const res = await api.get('/leads/export', { params, responseType: 'blob' });
  return res.data as Blob;
};
