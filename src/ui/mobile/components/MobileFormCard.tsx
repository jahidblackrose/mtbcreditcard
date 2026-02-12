/**
 * Mobile Form Card - Premium Banking Style
 * 
 * Clean white card with subtle shadow for form sections.
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
        'bg-card rounded-xl border border-border p-5',
        'shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]',
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
      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
