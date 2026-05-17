import { X, User, Mail, Calendar, Clock, Tag, Globe } from 'lucide-react';
import type { Lead } from '../../types/lead.types';
import { formatDateTime } from '../../utils/formatDate';
import { StatusBadge, SourceBadge } from './Badges';
import { useAuth } from '../../hooks/useAuth';

interface LeadViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const LeadViewModal = ({ isOpen, onClose, lead }: LeadViewModalProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md p-6 animate-slide-in shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lead Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">{lead.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="font-semibold text-gray-900 dark:text-white">{lead.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <StatusBadge status={lead.status} />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Source</p>
                <SourceBadge source={lead.source} />
              </div>
            </div>
          </div>

          {isAdmin && lead.createdBy && typeof lead.createdBy !== 'string' && (
            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl">
              <User className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                  Created By {lead.createdBy.role ? `(${lead.createdBy.role})` : ''}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">{lead.createdBy.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lead.createdBy.email}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(lead.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDateTime(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadViewModal;
