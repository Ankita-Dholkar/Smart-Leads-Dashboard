import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Download, Loader2, Users,
  TrendingUp, UserCheck, UserX, Edit2, Trash2, Eye, UserPlus
} from 'lucide-react';
import type { Lead, LeadFilters, LeadFormData, PaginationMeta } from '../types/lead.types';
import * as leadsApi from '../services/leads.api';
import { useAuth } from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import { formatDate } from '../utils/formatDate';
import { StatusBadge, SourceBadge } from '../components/common/Badges';
import Pagination from '../components/common/Pagination';
import FiltersBar from '../components/table/FiltersBar';
import LeadModal from '../components/forms/LeadModal';
import LeadViewModal from '../components/common/LeadViewModal';
import toast from 'react-hot-toast';
import axios from 'axios';

const DEFAULT_FILTERS: LeadFilters = {
  search: '', status: '', source: '', sort: 'latest', page: 1,
};

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [rawSearch, setRawSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = useDebounce(rawSearch, 500);

  // Sync debounced search into filters
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await leadsApi.getLeads(filters);
      setLeads(data.data);
      setMeta(data.meta);
    } catch {
      toast.error('Failed to load leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (key: keyof Omit<LeadFilters, 'search' | 'page'>, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setRawSearch('');
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateLead = async (data: LeadFormData) => {
    setModalSubmitting(true);
    try {
      await leadsApi.createLead(data);
      setModalOpen(false);
      toast.success('Lead created successfully!');
      fetchLeads();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? 'Failed to create lead.');
      } else {
        toast.error('Failed to create lead.');
      }
    }
    finally { setModalSubmitting(false); }
  };

  const handleUpdateLead = async (data: LeadFormData) => {
    if (!editLead) return;
    setModalSubmitting(true);
    try {
      await leadsApi.updateLead(editLead._id, data);
      setEditLead(null);
      setModalOpen(false);
      toast.success('Lead updated successfully!');
      fetchLeads();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? 'Failed to update lead.');
      } else {
        toast.error('Failed to update lead.');
      }
    }
    finally { setModalSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await leadsApi.deleteLead(id);
      setDeleteConfirm(null);
      toast.success('Lead deleted successfully!');
      fetchLeads();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? 'Failed to delete lead.');
      } else {
        toast.error('Failed to delete lead.');
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadsApi.exportLeadsCSV(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export started!');
    } catch { 
      toast.error('Failed to export leads.');
    }
    finally { setIsExporting(false); }
  };

  // Stats from current data
  const stats = {
    total: meta?.total ?? 0,
    newLeads: leads.filter((l) => l.status === 'New').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    lost: leads.filter((l) => l.status === 'Lost').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="export-csv"
            onClick={handleExport}
            disabled={isExporting}
            className="btn-secondary"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export CSV
          </button>
          <button
            id="add-lead-btn"
            onClick={() => { setEditLead(null); setModalOpen(true); }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="New" value={stats.newLeads} icon={UserPlus} color="bg-indigo-500" />
        <StatCard title="Qualified" value={stats.qualified} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Contacted" value={stats.contacted} icon={UserCheck} color="bg-yellow-500" />
        <StatCard title="Lost" value={stats.lost} icon={UserX} color="bg-red-500" />
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <FiltersBar
          filters={{ ...filters, search: rawSearch }}
          onSearchChange={setRawSearch}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">No leads found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filters.search || filters.status || filters.source
                ? 'Try adjusting your filters'
                : 'Add your first lead to get started'}
            </p>
            {!filters.search && !filters.status && !filters.source && (
              <button
                id="empty-add-lead"
                onClick={() => { setEditLead(null); setModalOpen(true); }}
                className="btn-primary mt-4"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && leads.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="table-header-cell">Name</th>
                    <th className="table-header-cell">Email</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Source</th>
                    <th className="table-header-cell">Created</th>
                    {isAdmin && <th className="table-header-cell">Created By</th>}
                    <th className="table-header-cell text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      id={`lead-row-${lead._id}`}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="table-cell font-medium text-gray-900 dark:text-white">{lead.name}</td>
                      <td className="table-cell text-gray-500 dark:text-gray-400">{lead.email}</td>
                      <td className="table-cell"><StatusBadge status={lead.status} /></td>
                      <td className="table-cell"><SourceBadge source={lead.source} /></td>
                      <td className="table-cell text-gray-500 dark:text-gray-400">{formatDate(lead.createdAt)}</td>
                      {isAdmin && (
                        <td className="table-cell text-gray-500 dark:text-gray-400">
                          {typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown'}
                        </td>
                      )}
                      <td className="table-cell">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            id={`view-lead-${lead._id}`}
                            onClick={() => setViewLead(lead)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`edit-lead-${lead._id}`}
                            onClick={() => { setEditLead(lead); setModalOpen(true); }}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              id={`delete-lead-${lead._id}`}
                              onClick={() => setDeleteConfirm(lead._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
          </>
        )}
      </div>

      {/* Lead Create/Edit Modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditLead(null); }}
        onSubmit={editLead ? handleUpdateLead : handleCreateLead}
        lead={editLead}
        isSubmitting={modalSubmitting}
      />

      {/* Lead View Modal */}
      <LeadViewModal
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        lead={viewLead}
      />

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-sm p-6 animate-slide-in shadow-xl">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Delete Lead?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              This action cannot be undone. The lead will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                id="cancel-delete"
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                id="confirm-delete"
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-danger flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
