import React from 'react';
import { Eye, Pencil, Trash2, Globe, Instagram, Users } from 'lucide-react';
import { Lead } from '../../types/lead.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useAuth } from '../../hooks/useAuth';

// ── Skeleton Row ────────────────────────────────────────────────────────────
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-100 dark:border-gray-800">
    {[1, 2, 3, 4, 5, 6].map((col) => (
      <td key={col} className="px-4 py-4">
        <div className={`skeleton h-4 rounded ${col === 1 ? 'w-32' : col === 2 ? 'w-40' : col === 6 ? 'w-20' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

// ── Source Icon ─────────────────────────────────────────────────────────────
const SourceIcon: React.FC<{ source: Lead['source'] }> = ({ source }) => {
  const icons = {
    Website: <Globe size={14} />,
    Instagram: <Instagram size={14} />,
    Referral: <Users size={14} />,
  };
  return <span className="text-gray-400">{icons[source]}</span>;
};

// ── Table Props ─────────────────────────────────────────────────────────────
interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  hasFilters: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

/**
 * LeadTable — responsive data table with skeleton loading, empty state,
 * status badges, action buttons, and role-based delete visibility.
 */
export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  hasFilters,
  onView,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card overflow-hidden">
      {/* Horizontal scroll wrapper for small screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60">
              <th className="px-4 py-3.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Email
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Source
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Created
              </th>
              <th className="px-4 py-3.5 text-right font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton rows */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!isLoading && leads.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    message={hasFilters ? 'No results found' : 'No leads yet'}
                    description={
                      hasFilters
                        ? 'Try adjusting your filters or search term.'
                        : 'Create your first lead using the "Add Lead" button above.'
                    }
                  />
                </td>
              </tr>
            )}

            {/* Lead rows */}
            {!isLoading &&
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {lead.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {lead.email}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <SourceIcon source={lead.source} />
                      <span className="text-xs">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* View button — always visible */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(lead)}
                        aria-label={`View ${lead.name}`}
                        title="View details"
                      >
                        <Eye size={14} />
                      </Button>

                      {/* Edit button — all roles */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                        aria-label={`Edit ${lead.name}`}
                        title="Edit lead"
                      >
                        <Pencil size={14} />
                      </Button>

                      {/* Delete — admin only */}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(lead)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          aria-label={`Delete ${lead.name}`}
                          title="Delete lead"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
