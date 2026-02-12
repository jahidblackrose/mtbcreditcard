/**
 * MTB Credit Card Application - Status Badge
 * 
 * Pill-style badges with semantic colors.
 */

import { cn } from '@/lib/utils';
import type { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
  },
  PENDING_OTP: {
    label: 'Pending OTP',
    className: 'bg-warning/15 text-warning',
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-info/15 text-info',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'bg-warning/15 text-warning',
  },
  DOCUMENTS_REQUIRED: {
    label: 'Documents Required',
    className: 'bg-warning/15 text-warning',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-success/15 text-success',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-destructive/15 text-destructive',
  },
  CARD_ISSUED: {
    label: 'Card Issued',
    className: 'bg-success/15 text-success',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
