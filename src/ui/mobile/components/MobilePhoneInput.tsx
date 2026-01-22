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
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <span className="text-lg">{countryFlag}</span>
            <span className="text-[15px] font-medium text-foreground">{countryCode}</span>
            <div className="w-px h-5 bg-gray-200 ml-1" />
          </div>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            className={cn(
              // White background, very light border like attachment
              'w-full bg-white rounded-2xl',
              'border border-gray-200',
              'pl-28 pr-5 py-4 text-[15px] text-foreground',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
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
