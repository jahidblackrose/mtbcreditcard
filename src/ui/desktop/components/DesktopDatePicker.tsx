/**
 * Desktop Date Picker - Tailwind-style with Calendar popup
 * 
 * Uses TailwindCalendar for rock-solid stability:
 * - Date/Month/Year views
 * - DD/MM/YYYY format
 * - Never auto-closes during navigation
 */

import { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TailwindCalendar } from '@/components/ui/tailwind-date-picker';

interface DesktopDatePickerProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

// Format date as DD/MM/YYYY
function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DesktopDatePicker({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  error,
  helperText,
  minDate,
  maxDate,
  disabled = false,
}: DesktopDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

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
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={toggleCalendar}
        className={cn(
          'w-full justify-start text-left font-normal',
          !value && 'text-muted-foreground',
          error && 'border-destructive'
        )}
      >
        {value ? formatDateDDMMYYYY(value) : placeholder}
        <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground" />
      </Button>

      {/* Calendar Popup */}
      {isOpen && (
        <div 
          className="absolute z-[500] mt-1 left-0"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <TailwindCalendar
            selected={value}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
