/**
 * Mobile Floating Label Input - Banking App Style
 * 
 * Matches attachment exactly:
 * - Empty: placeholder text inside
 * - Filled: small floating label above, value below
 * - White card with light gray border
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobileFloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export const MobileFloatingInput = forwardRef<HTMLInputElement, MobileFloatingInputProps>(
  ({ label, error, rightIcon, className, value, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    const isFloating = isFocused || hasValue;

    return (
      <div className="w-full">
        <div className="relative">
          <input
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
              // White card style with light border
              'w-full bg-white rounded-2xl',
              'border border-gray-200',
              // Large padding with space for floating label
              'px-5 pt-6 pb-3 text-[15px] font-medium text-foreground',
              'placeholder-transparent',
              // Focus state with MTB green
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              rightIcon && 'pr-12',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              className
            )}
            placeholder={label}
            {...props}
          />
          
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
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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

MobileFloatingInput.displayName = 'MobileFloatingInput';
