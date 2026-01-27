/**
 * Mobile Floating Label Date Input - Banking App Style
 * 
 * Matches attachment:
 * - Empty: placeholder inside
 * - Selected: small label floating, date value below
 * - Calendar icon on right
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
import { usePopoverCloseGuard } from '@/hooks/usePopoverCloseGuard';

interface MobileFloatingDateInputProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  label: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  minAge?: number;
  disabled?: boolean;
  className?: string;
}

export function MobileFloatingDateInput({
  value,
  onChange,
  label,
  error,
  minDate,
  maxDate,
  minAge,
  disabled = false,
  className,
}: MobileFloatingDateInputProps) {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { markInteracting, shouldIgnoreClose, resetInteracting } = usePopoverCloseGuard();

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
    resetInteracting();
    setOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (calculatedMaxDate && date > calculatedMaxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  const hasValue = !!dateValue;
  const isFloating = isFocused || hasValue || open;

  return (
    <div className={cn('w-full', className)}>
      <Popover 
        open={open} 
        onOpenChange={(v) => {
          if (shouldIgnoreClose(v)) return;
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
              'bg-card rounded-2xl border border-border',
              'px-5 pt-6 pb-3',
              'focus:outline-none focus:ring-2 focus:ring-success/20 focus:border-success',
              'transition-all duration-200',
              error && 'border-destructive focus:ring-destructive/20 focus:border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Floating Label */}
            <span
              className={cn(
                'absolute left-5 transition-all duration-200 pointer-events-none',
                isFloating
                  ? 'top-2 text-xs text-muted-foreground font-normal'
                  : 'top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground font-normal'
              )}
            >
              {label}
            </span>
            
            {/* Value */}
            <span className={cn(
              'text-[15px] font-medium block mt-1',
              hasValue ? 'text-foreground' : 'text-transparent'
            )}>
              {dateValue ? `${String(dateValue.getDate()).padStart(2, '0')}-${String(dateValue.getMonth() + 1).padStart(2, '0')}-${dateValue.getFullYear()}` : 'DD-MM-YYYY'}
            </span>
            
            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-background border border-border shadow-xl z-[200]" 
          align="start"
          sideOffset={4}
          onPointerDownCapture={markInteracting}
          onWheelCapture={markInteracting}
        >
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={isDateDisabled}
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
