/**
 * MTB Credit Card Application - Status Badge
 * 
 * Displays application status with appropriate styling.
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
    className: 'bg-warning/10 text-warning',
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-info/10 text-info',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'bg-warning/10 text-warning',
  },
  DOCUMENTS_REQUIRED: {
    label: 'Documents Required',
    className: 'bg-warning/10 text-warning',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-success/10 text-success',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive',
  },
  CARD_ISSUED: {
    label: 'Card Issued',
    className: 'bg-success/10 text-success',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
