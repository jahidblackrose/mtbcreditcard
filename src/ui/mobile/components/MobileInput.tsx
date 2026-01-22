/**
 * Mobile Input - Banking App Style
 * 
 * Large padding, rounded card style, clean placeholder.
 */

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 px-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-card rounded-xl border border-border/50',
              'px-4 py-3.5 text-base text-foreground',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success',
              'transition-all duration-200',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';
