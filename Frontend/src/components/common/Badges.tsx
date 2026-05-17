import type { Lead } from '../../types/lead.types';

interface StatusBadgeProps {
  status: Lead['status'];
}

const statusMap: Record<Lead['status'], string> = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Qualified: 'badge-qualified',
  Lost: 'badge-lost',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={statusMap[status]}>{status}</span>
);

interface SourceBadgeProps {
  source: Lead['source'];
}

const sourceMap: Record<Lead['source'], string> = {
  Website: 'badge-website',
  Instagram: 'badge-instagram',
  Referral: 'badge-referral',
};

export const SourceBadge = ({ source }: SourceBadgeProps) => (
  <span className={sourceMap[source]}>{source}</span>
);
