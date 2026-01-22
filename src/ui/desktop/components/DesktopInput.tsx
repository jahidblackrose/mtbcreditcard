/**
 * Desktop Input - Bootstrap-style Form Input
 * 
 * Standard web form input with:
 * - White background, light gray border
 * - Green border on focus (MTB theme)
 * - Clean label above input
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DesktopInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  rightIcon?: React.ReactNode;
}

export const DesktopInput = forwardRef<HTMLInputElement, DesktopInputProps>(
  ({ label, error, helperText, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Bootstrap-style input
              'w-full bg-white rounded-lg',
              'border border-input',
              'px-4 py-2.5 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              // Focus state with MTB green
              'focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success',
              'transition-colors duration-200',
              rightIcon && 'pr-10',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
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

DesktopInput.displayName = 'DesktopInput';
