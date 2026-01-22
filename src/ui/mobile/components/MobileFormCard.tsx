/**
 * Mobile Form Card - Banking App Style Input Container
 * 
 * Rounded card with white background for form inputs.
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileFormCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileFormCard({ children, className }: MobileFormCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border/50 p-4',
        'shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileFormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function MobileFormSection({ title, children, className }: MobileFormSectionProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
