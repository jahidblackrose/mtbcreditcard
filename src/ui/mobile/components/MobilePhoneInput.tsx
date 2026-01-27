/**
 * Mobile Phone Input - Bangladesh 11-digit format (01XXXXXXXXX)
 * 
 * - No +880 prefix
 * - Only accepts 11 digits starting with 01
 * - Floating label when focused/filled
 * - No placeholder text inside input
 */

import { forwardRef, InputHTMLAttributes, useState, useEffect, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface MobilePhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'placeholder'> {
  label?: string;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const MobilePhoneInput = forwardRef<HTMLInputElement, MobilePhoneInputProps>(
  ({ label = 'Mobile Number', error, className, value, onFocus, onBlur, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
      setHasValue(!!value && String(value).length > 0);
    }, [value]);

    const isFloating = isFocused || hasValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Only allow digits and limit to 11 characters
      const rawValue = e.target.value.replace(/\D/g, '').slice(0, 11);
      
      // Create a synthetic event with the cleaned value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: rawValue,
          name: e.target.name,
        },
      } as ChangeEvent<HTMLInputElement>;
      
      onChange?.(syntheticEvent);
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            maxLength={11}
            placeholder=""
            className={cn(
              // White card style with light border
              'w-full bg-white rounded-2xl',
              'border border-gray-200',
              // Large padding with floating label space
              'px-5 pt-6 pb-3 text-[15px] font-medium',
              // Force dark text for visibility - caret visible
              'text-gray-900 caret-gray-900',
              'placeholder:text-transparent',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive bg-destructive/5 focus:ring-destructive/20 focus:border-destructive',
              className
            )}
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
        </div>
        
        {/* Helper text for format - only show when not in error state */}
        {!error && (
          <p className="text-xs text-muted-foreground mt-1.5 px-1">Format: 01XXXXXXXXX (11 digits)</p>
        )}
        
        {error && (
          <p className="text-xs text-destructive mt-1.5 px-1 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

MobilePhoneInput.displayName = 'MobilePhoneInput';
