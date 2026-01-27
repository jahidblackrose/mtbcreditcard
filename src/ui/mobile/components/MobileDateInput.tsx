/**
 * Mobile Date Input - Banking App Style with Floating Labels
 * Uses DD-MON-YYYY format (e.g., 16-JAN-2004)
 */

import { useState, useMemo } from 'react';
import { subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateDDMONYYYY } from '@/lib/bangladesh-locations';

interface MobileDateInputProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  minAge?: number;
  disabled?: boolean;
  className?: string;
}

export function MobileDateInput({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  minDate,
  maxDate,
  minAge,
  disabled = false,
  className,
}: MobileDateInputProps) {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const calculatedMaxDate = useMemo(() => {
    if (minAge) {
      return subYears(new Date(), minAge);
    }
    return maxDate;
  }, [minAge, maxDate]);

  const dateValue = useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (calculatedMaxDate && date > calculatedMaxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  const hasValue = !!dateValue;
  const isFloating = isFocused || hasValue || open;
  const displayLabel = label || placeholder;

  return (
    <div className={cn('w-full', className)}>
      <Popover 
        open={open} 
        onOpenChange={(v) => {
          setOpen(v);
          setIsFocused(v);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'w-full relative text-left',
              'bg-white rounded-2xl border border-gray-200',
              'px-5 pt-6 pb-3',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Floating Label */}
            {displayLabel && (
              <span
                className={cn(
                  'absolute left-5 transition-all duration-200 pointer-events-none',
                  isFloating
                    ? 'top-2 text-xs text-gray-400 font-normal'
                    : 'top-1/2 -translate-y-1/2 text-[15px] text-gray-400 font-normal'
                )}
              >
                {displayLabel}
              </span>
            )}
            
            {/* Value - DD-MON-YYYY format */}
            <span className={cn(
              'text-[15px] font-medium block mt-1',
              hasValue ? 'text-foreground' : 'text-transparent'
            )}>
              {dateValue ? formatDateDDMONYYYY(dateValue) : 'Select'}
            </span>
            
            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-background border border-border shadow-xl z-[200]" 
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
            defaultMonth={dateValue || calculatedMaxDate || new Date()}
            fromYear={minDate?.getFullYear() || 1940}
            toYear={calculatedMaxDate?.getFullYear() || new Date().getFullYear()}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
      )}
    </div>
  );
}
