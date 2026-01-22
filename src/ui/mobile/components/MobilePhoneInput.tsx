/**
 * Mobile Phone Input - Banking App Style
 * 
 * Left: country flag + code inside the input
 * Right: phone number
 */

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MobilePhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  countryCode?: string;
  countryFlag?: string;
}

export const MobilePhoneInput = forwardRef<HTMLInputElement, MobilePhoneInputProps>(
  ({ label, error, countryCode = '+880', countryFlag = '🇧🇩', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-muted-foreground mb-1.5 px-1">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground pointer-events-none">
            <span className="text-lg">{countryFlag}</span>
            <span className="text-sm font-medium text-foreground/70">{countryCode}</span>
            <div className="w-px h-5 bg-border ml-1" />
          </div>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            className={cn(
              'w-full bg-card rounded-xl border border-border/50',
              'pl-24 pr-4 py-3.5 text-base text-foreground',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-success/30 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
        )}
      </div>
    );
  }
);

MobilePhoneInput.displayName = 'MobilePhoneInput';
