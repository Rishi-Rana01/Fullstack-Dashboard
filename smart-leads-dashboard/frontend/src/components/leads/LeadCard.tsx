import React from 'react';
import { Lead } from '../../types/lead.types';
import { Badge } from '../ui/Badge';
import { Globe, Instagram, Users, Calendar } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

const SourceIcon: React.FC<{ source: Lead['source'] }> = ({ source }) => {
  const config = {
    Website: { Icon: Globe, color: 'text-blue-500' },
    Instagram: { Icon: Instagram, color: 'text-pink-500' },
    Referral: { Icon: Users, color: 'text-emerald-500' },
  };
  const { Icon, color } = config[source];
  return <Icon size={14} className={color} />;
};

/**
 * LeadCard — a compact card view of a lead for mobile/grid layouts.
 * Provides an alternative to the table view for narrow screens.
 */
export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={[
        'card p-4 space-y-3 transition-all duration-200',
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800'
          : '',
      ].join(' ')}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
            {lead.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate mt-0.5">
            {lead.email}
          </p>
        </div>
        <Badge status={lead.status} />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <SourceIcon source={lead.source} />
          <span>{lead.source}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
