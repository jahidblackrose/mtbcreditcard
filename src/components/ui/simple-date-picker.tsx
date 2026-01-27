/**
 * Simple Date Picker - Bootstrap Style
 * 
 * Features:
 * - Uses SimpleCalendar (no year dropdown)
 * - Rock-solid stability
 * - DD-MM-YYYY format
 * - Closes ONLY on date selection or outside click
 */

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SimpleCalendar } from "@/components/ui/simple-calendar";

// Format date as DD-MM-YYYY
function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

interface SimpleDatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minAge?: number;
  className?: string;
  error?: boolean;
}

export function SimpleDatePicker({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
  disabled = false,
  minDate,
  maxDate,
  minAge,
  className,
  error,
}: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Calculate max date based on minimum age
  const calculatedMaxDate = React.useMemo(() => {
    if (minAge) {
      return subYears(new Date(), minAge);
    }
    return maxDate;
  }, [minAge, maxDate]);

  // Parse value to Date
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  }, [value]);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  // Handle outside click
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Delay adding listener to prevent immediate close
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
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={toggleCalendar}
        className={cn(
          "w-full justify-start text-left font-normal",
          !dateValue && "text-muted-foreground",
          error && "border-destructive",
          className
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateValue ? formatDateDDMMYYYY(dateValue) : <span>{placeholder}</span>}
      </Button>

      {isOpen && (
        <div 
          className="absolute z-[500] mt-1"
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
    </div>
  );
}

SimpleDatePicker.displayName = "SimpleDatePicker";
