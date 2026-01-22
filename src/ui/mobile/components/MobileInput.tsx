/**
 * Mobile Input - Banking App Style with Floating Labels
 * 
 * Matches attachment exactly:
 * - Empty: placeholder inside
 * - Filled: floating label above, value below
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, leftIcon, rightIcon, className, value, onFocus, onBlur, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    const isFloating = isFocused || hasValue;
    const displayLabel = label || placeholder;

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
              {leftIcon}
            </div>
          )}
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
              'px-5 pt-6 pb-3 text-[15px] font-medium',
              // Force dark text color and visible caret for readability
              'text-gray-900 dark:text-gray-900 caret-gray-900',
              // Hide native placeholder - we use floating label instead
              'placeholder:text-transparent',
              // Focus state with MTB green
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              className
            )}
            placeholder=""
            {...props}
          />
          
          {/* Floating Label */}
          {displayLabel && (
            <label
              className={cn(
                'absolute transition-all duration-200 pointer-events-none',
                leftIcon ? 'left-12' : 'left-5',
                isFloating
                  ? 'top-2 text-xs text-gray-400 font-normal'
                  : 'top-1/2 -translate-y-1/2 text-[15px] text-gray-400 font-normal'
              )}
            >
              {displayLabel}
            </label>
          )}
          
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
