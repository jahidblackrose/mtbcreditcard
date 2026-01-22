/**
 * Mobile Floating Label Select - Banking App Style
 * 
 * Matches attachment:
 * - Empty: placeholder inside
 * - Selected: small label floating, value below
 * - Chevron on right
 */

import { forwardRef, SelectHTMLAttributes, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileFloatingSelectOption {
  value: string;
  label: string;
}

interface MobileFloatingSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  error?: string;
  options: MobileFloatingSelectOption[];
}

export const MobileFloatingSelect = forwardRef<HTMLSelectElement, MobileFloatingSelectProps>(
  ({ label, error, options, className, value, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    const isFloating = isFocused || hasValue;

    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
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
              // White card style
              'w-full bg-white rounded-2xl',
              'border border-gray-200 appearance-none',
              // Large padding with floating label space
              'px-5 pt-6 pb-3 text-[15px] font-medium text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200 cursor-pointer',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              !hasValue && 'text-transparent',
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>
              {label}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Floating Label */}
          <label
            className={cn(
              'absolute left-5 transition-all duration-200 pointer-events-none',
              isFloating
                ? 'top-2 text-xs text-gray-400 font-normal'
                : 'top-1/2 -translate-y-1/2 text-[15px] text-gray-400 font-normal'
            )}
          >
            {label}
          </label>
          
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
        )}
      </div>
    );
  }
);

MobileFloatingSelect.displayName = 'MobileFloatingSelect';
