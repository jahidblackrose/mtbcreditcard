/**
 * Mobile Date Input - Banking App Style
 * 
 * Right-side calendar icon button inside the field.
 * Uses the improved calendar with month/year dropdowns.
 */

import { useState, useMemo } from 'react';
import { format, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  // Calculate max date based on minimum age if provided
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

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5 px-1">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              // White background, very light border like attachment
              'w-full flex items-center justify-between',
              'bg-white rounded-2xl border border-gray-200',
              'px-5 py-4 text-[15px] text-left',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              !dateValue && 'text-gray-400',
              dateValue && 'text-foreground',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span>
              {dateValue ? format(dateValue, 'PPP') : placeholder}
            </span>
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-[100]" 
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
