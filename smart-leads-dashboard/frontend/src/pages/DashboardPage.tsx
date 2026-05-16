import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Plus,
  Download,
  Users,
  TrendingUp,
  PhoneCall,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLeads } from '../hooks/useLeads';
import { deleteLeadApi, exportLeadsCsvApi } from '../api/lead.api';
import { downloadCSV } from '../utils/csvDownload';
import { Lead, LeadFilters } from '../types/lead.types';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

// ── Initial Filter State ─────────────────────────────────────────────────────
const INITIAL_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

// ── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color,
  bgColor,
  isLoading,
}) => (
  <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColor} ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      {isLoading ? (
        <div className="skeleton h-7 w-12 mt-1 rounded" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">
          {value.toLocaleString()}
        </p>
      )}
    </div>
  </div>
);

// ── Modal State Shape ─────────────────────────────────────────────────────────
type ModalType = 'create' | 'edit' | 'view' | 'delete' | null;

interface ModalState {
  type: ModalType;
  lead: Lead | null;
}

/**
 * DashboardPage — the main application view.
 * Contains stat cards, filters, lead table, pagination, and modal flows.
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(INITIAL_FILTERS);
  const [modal, setModal] = useState<ModalState>({ type: null, lead: null });
  const [isExporting, setIsExporting] = useState(false);

  // ── Data fetching ────────────────────────────────────────────────────────
  const { leads, pagination, isLoading } = useLeads(filters);

  // Fetch total counts for stat cards — always unfiltered
  const { leads: allLeads } = useLeads({ ...INITIAL_FILTERS, limit: 1000 } as LeadFilters);

  // ── Stat calculations ────────────────────────────────────────────────────
  const stats = React.useMemo(() => {
    const counts = { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    allLeads.forEach((lead) => {
      counts[lead.status] = (counts[lead.status] ?? 0) + 1;
    });
    return counts;
  }, [allLeads]);

  // ── Delete mutation ──────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLeadApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully.');
      closeModal();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete lead.');
    },
  });

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openModal = useCallback((type: ModalType, lead: Lead | null = null) => {
    setModal({ type, lead });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, lead: null });
  }, []);

  // ── CSV Export ───────────────────────────────────────────────────────────
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const blob = await exportLeadsCsvApi({
        status: filters.status,
        source: filters.source,
        search: filters.search,
      });
      downloadCSV(blob, `leads-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('CSV exported successfully!');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message ?? 'Failed to export CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Filters handler ──────────────────────────────────────────────────────
  const handleFiltersChange = useCallback((newFilters: LeadFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const hasActiveFilters =
    filters.status !== '' ||
    filters.source !== '' ||
    filters.search !== '';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        {/* Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle="Leads Dashboard"
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ── Stat Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Leads"
              value={pagination?.total ?? 0}
              icon={<Users size={20} />}
              color="text-brand-600 dark:text-brand-400"
              bgColor="bg-brand-50 dark:bg-brand-900/30"
              isLoading={isLoading}
            />
            <StatCard
              label="New"
              value={stats.New}
              icon={<TrendingUp size={20} />}
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/30"
              isLoading={isLoading}
            />
            <StatCard
              label="Contacted"
              value={stats.Contacted}
              icon={<PhoneCall size={20} />}
              color="text-amber-600 dark:text-amber-400"
              bgColor="bg-amber-50 dark:bg-amber-900/30"
              isLoading={isLoading}
            />
            <StatCard
              label="Qualified"
              value={stats.Qualified}
              icon={<TrendingUp size={20} />}
              color="text-emerald-600 dark:text-emerald-400"
              bgColor="bg-emerald-50 dark:bg-emerald-900/30"
              isLoading={isLoading}
            />
          </div>

          {/* ── Filter Bar ─────────────────────────────────────────────── */}
          <LeadFiltersBar filters={filters} onChange={handleFiltersChange} />

          {/* ── Table Header Row (action buttons) ─────────────────────── */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                All Leads
              </h2>
              {pagination && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination.total.toLocaleString()} total record
                  {pagination.total !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* CSV Export — admin only */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  isLoading={isExporting}
                  leftIcon={
                    isExporting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )
                  }
                >
                  Export CSV
                </Button>
              )}

              {/* Add lead */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => openModal('create')}
                leftIcon={<Plus size={14} />}
              >
                Add Lead
              </Button>
            </div>
          </div>

          {/* ── Leads Table ────────────────────────────────────────────── */}
          <LeadTable
            leads={leads}
            isLoading={isLoading}
            hasFilters={hasActiveFilters}
            onView={(lead) => openModal('view', lead)}
            onEdit={(lead) => openModal('edit', lead)}
            onDelete={(lead) => openModal('delete', lead)}
          />

          {/* ── Pagination ─────────────────────────────────────────────── */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}

      {/* Create Lead */}
      <Modal
        isOpen={modal.type === 'create'}
        onClose={closeModal}
        title="Add New Lead"
        size="md"
      >
        <LeadForm onSuccess={closeModal} onClose={closeModal} />
      </Modal>

      {/* Edit Lead */}
      <Modal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        title="Edit Lead"
        size="md"
      >
        {modal.lead && (
          <LeadForm
            lead={modal.lead}
            onSuccess={closeModal}
            onClose={closeModal}
          />
        )}
      </Modal>

      {/* View Lead */}
      <Modal
        isOpen={modal.type === 'view'}
        onClose={closeModal}
        title="Lead Details"
        size="md"
      >
        {modal.lead && (
          <LeadDetailModal
            lead={modal.lead}
            onClose={closeModal}
            onEdit={
              () => openModal('edit', modal.lead)
            }
          />
        )}
      </Modal>

      {/* Delete Confirmation — admin only */}
      <Modal
        isOpen={modal.type === 'delete'}
        onClose={closeModal}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <XCircle size={24} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {modal.lead?.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={closeModal}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              isLoading={deleteMutation.isPending}
              onClick={() => modal.lead && deleteMutation.mutate(modal.lead._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
