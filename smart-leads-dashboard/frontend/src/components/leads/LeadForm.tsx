import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createLeadApi, updateLeadApi } from '../../api/lead.api';
import { Lead, LeadFormData } from '../../types/lead.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

// ── Zod Validation Schema ───────────────────────────────────────────────────
const leadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name cannot exceed 100 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost'], {
    errorMap: () => ({ message: 'Please select a valid status.' }),
  }),
  source: z.enum(['Website', 'Instagram', 'Referral'], {
    errorMap: () => ({ message: 'Please select a valid source.' }),
  }),
});

type LeadFormSchema = z.infer<typeof leadSchema>;

// ── Props ───────────────────────────────────────────────────────────────────
interface LeadFormProps {
  /** If provided, the form operates in edit mode with pre-filled values */
  lead?: Lead;
  onSuccess: () => void;
  onClose: () => void;
}

const selectClass = [
  'w-full rounded-lg border border-gray-300 dark:border-gray-700',
  'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300',
  'text-sm px-3 py-2.5',
  'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
  'transition-colors disabled:opacity-60',
].join(' ');

/**
 * LeadForm — create or edit a lead with Zod validation.
 * Invalidates the leads query on success to trigger a table refresh.
 */
export const LeadForm: React.FC<LeadFormProps> = ({
  lead,
  onSuccess,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? 'New',
      source: lead?.source ?? 'Website',
    },
  });

  // ── Mutations ───────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: LeadFormData) => createLeadApi(data),
    onSuccess: () => {
      // Invalidate the leads query so the table refreshes with the new lead
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
      onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to create lead.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<LeadFormData>) =>
      updateLeadApi(lead!._id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully!');
      onSuccess();
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update lead.');
    },
  });

  const onSubmit = (data: LeadFormSchema) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Name */}
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Status <span className="text-red-500">*</span>
        </label>
        <select className={selectClass} {...register('status')}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
        {errors.status && (
          <p className="text-xs text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* Source */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Source <span className="text-red-500">*</span>
        </label>
        <select className={selectClass} {...register('source')}>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
        {errors.source && (
          <p className="text-xs text-red-500">{errors.source.message}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isPending || isSubmitting}
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
