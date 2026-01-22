/**
 * Mobile Select - Banking App Style
 * 
 * Rounded field with chevron on right.
 */

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSelectOption {
  value: string;
  label: string;
}

interface MobileSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: MobileSelectOption[];
  placeholder?: string;
}

export const MobileSelect = forwardRef<HTMLSelectElement, MobileSelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 px-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full bg-card rounded-xl border border-border/50',
              'px-4 py-3.5 text-base text-foreground appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success',
              'transition-all duration-200 cursor-pointer',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              !props.value && 'text-muted-foreground/60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
        )}
      </div>
    );
  }
);

MobileSelect.displayName = 'MobileSelect';
