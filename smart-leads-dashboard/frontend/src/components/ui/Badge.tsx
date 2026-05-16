import React from 'react';
import { LeadStatus } from '../../types/lead.types';

interface BadgeProps {
  status: LeadStatus;
}

// Color mapping: each status has a unique color combination for light and dark modes
const statusConfig: Record<
  LeadStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  New: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
    label: 'New',
  },
  Contacted: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Contacted',
  },
  Qualified: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'Qualified',
  },
  Lost: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
    label: 'Lost',
  },
};

/**
 * Badge — color-coded pill that displays a lead's status.
 * Each status has a distinct background, text color, and indicator dot.
 */
export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.bg,
        config.text,
      ].join(' ')}
    >
      {/* Status indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
};
