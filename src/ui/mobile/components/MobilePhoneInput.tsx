/**
 * Mobile Phone Input - Banking App Style with Floating Labels
 * 
 * Matches attachment:
 * - Left: country flag + code inside the input
 * - Floating label when focused/filled
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobilePhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  countryCode?: string;
  countryFlag?: string;
}

export const MobilePhoneInput = forwardRef<HTMLInputElement, MobilePhoneInputProps>(
  ({ label, error, countryCode = '+880', countryFlag = '🇧🇩', className, value, onFocus, onBlur, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    const isFloating = isFocused || hasValue;
    const displayLabel = label || placeholder || 'Mobile Number';

    return (
      <div className="w-full">
        <div className="relative">
          {/* Country Code Section */}
          <div className={cn(
            "absolute left-5 flex items-center gap-2 pointer-events-none transition-all duration-200",
            isFloating ? 'top-[22px]' : 'top-1/2 -translate-y-1/2'
          )}>
            <span className="text-lg">{countryFlag}</span>
            <span className="text-[15px] font-medium text-foreground">{countryCode}</span>
            <div className="w-px h-5 bg-gray-200 ml-1" />
          </div>
          
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              // White card style with light border
              'w-full bg-white rounded-2xl',
              'border border-gray-200',
              // Large padding with floating label space
              'pl-28 pr-5 pt-6 pb-3 text-[15px] font-medium text-foreground',
              'placeholder-transparent',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              className
            )}
            placeholder={displayLabel}
            {...props}
          />
          
          {/* Floating Label */}
          {displayLabel && (
            <label
              className={cn(
                'absolute left-5 transition-all duration-200 pointer-events-none',
                isFloating
                  ? 'top-2 text-xs text-gray-400 font-normal'
                  : 'top-1/2 -translate-y-1/2 text-[15px] text-gray-400 font-normal opacity-0'
              )}
            >
              {displayLabel}
            </label>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
        )}
      </div>
    );
  }
);

MobilePhoneInput.displayName = 'MobilePhoneInput';
