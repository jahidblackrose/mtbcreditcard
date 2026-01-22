/**
 * Desktop Select - Bootstrap-style Form Select
 * 
 * Standard web form select with:
 * - White background, light gray border
 * - Green border on focus (MTB theme)
 * - Clean label above select
 */

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface DesktopSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export const DesktopSelect = forwardRef<HTMLSelectElement, DesktopSelectProps>(
  ({ label, options, placeholder = 'Select...', error, helperText, className, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Bootstrap-style select
              'w-full bg-white rounded-lg appearance-none',
              'border border-input',
              'px-4 py-2.5 pr-10 text-sm text-foreground',
              // Focus state with MTB green
              'focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success',
              'transition-colors duration-200',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {helperText && !error && (
          <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }
);

DesktopSelect.displayName = 'DesktopSelect';
