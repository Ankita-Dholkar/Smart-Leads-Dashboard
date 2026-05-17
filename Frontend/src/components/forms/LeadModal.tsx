import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import type { Lead, LeadFormData } from '../../types/lead.types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  lead?: Lead | null;
  isSubmitting: boolean;
}

const LeadModal = ({ isOpen, onClose, onSubmit, lead, isSubmitting }: LeadModalProps) => {
  const isEdit = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  // Populate form when editing or clear when creating
  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
      } else {
        reset({ name: '', email: '', status: 'New', source: 'Website' });
      }
    }
  }, [isOpen, lead, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="card w-full max-w-md p-6 animate-slide-in shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <button
            id="modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form id="lead-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="form-label">Full Name</label>
            <input
              id="lead-name"
              type="text"
              placeholder="John Doe"
              className="form-input"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="lead-email" className="form-label">Email Address</label>
            <input
              id="lead-email"
              type="email"
              placeholder="lead@example.com"
              className="form-input"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lead-status" className="form-label">Status</label>
              <select id="lead-status" className="form-select" {...register('status', { required: 'Status is required' })}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {errors.status && <p className="form-error">{errors.status.message}</p>}
            </div>

            <div>
              <label htmlFor="lead-source" className="form-label">Source</label>
              <select id="lead-source" className="form-select" {...register('source', { required: 'Source is required' })}>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="form-error">{errors.source.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              id="modal-cancel"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="modal-submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
