import React from 'react';
import { Lead } from '../../types/lead.types';
import { Badge } from '../ui/Badge';
import { Globe, Instagram, Users, Calendar, Mail, User, Tag } from 'lucide-react';
import { Button } from '../ui/Button';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit?: () => void;
}

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
        {value}
      </div>
    </div>
  </div>
);

const SourceIcon: React.FC<{ source: Lead['source'] }> = ({ source }) => {
  const icons = { Website: Globe, Instagram: Instagram, Referral: Users };
  const Icon = icons[source];
  return <Icon size={16} />;
};

/**
 * LeadDetailModal body — shows all lead fields in a structured, icon-driven layout.
 * Used inside the Modal component from the parent page.
 */
export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onEdit,
}) => {
  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="space-y-2 animate-fade-in">
      <DetailRow
        icon={<User size={16} />}
        label="Full Name"
        value={lead.name}
      />
      <DetailRow
        icon={<Mail size={16} />}
        label="Email Address"
        value={
          <a
            href={`mailto:${lead.email}`}
            className="text-brand-500 hover:underline font-mono text-xs"
          >
            {lead.email}
          </a>
        }
      />
      <DetailRow
        icon={<Tag size={16} />}
        label="Status"
        value={<Badge status={lead.status} />}
      />
      <DetailRow
        icon={<SourceIcon source={lead.source} />}
        label="Source"
        value={lead.source}
      />
      <DetailRow
        icon={<Calendar size={16} />}
        label="Created At"
        value={formatDate(lead.createdAt)}
      />

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Close
        </Button>
        {onEdit && (
          <Button variant="primary" className="flex-1" onClick={onEdit}>
            Edit Lead
          </Button>
        )}
      </div>
    </div>
  );
};
