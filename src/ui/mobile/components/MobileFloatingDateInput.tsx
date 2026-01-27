/**
 * Mobile Floating Label Date Input - Banking App Style
 * Uses SimpleCalendar for rock-solid stability
 * 
 * Matches attachment:
 * - Empty: placeholder inside
 * - Selected: small label floating, date value below
 * - Calendar icon on right
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SimpleCalendar } from '@/components/ui/simple-calendar';

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

// Format date as DD-MM-YYYY
function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setIsOpen(false);
    setIsFocused(false);
  };

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleCalendar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const hasValue = !!dateValue;
  const isFloating = isFocused || hasValue || isOpen;

  return (
    <div ref={containerRef} className={cn('w-full relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleCalendar}
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
          {dateValue ? formatDateDDMMYYYY(dateValue) : 'DD-MM-YYYY'}
        </span>
        
        <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <div 
          className="absolute z-[500] mt-1 left-0"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <SimpleCalendar
            selected={dateValue}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={calculatedMaxDate}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
      )}
    </div>
  );
}
