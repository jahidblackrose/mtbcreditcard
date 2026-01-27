/**
 * Tailwind-Style Date Picker
 * 
 * Features:
 * - Three views: DATE, MONTH, YEAR RANGE
 * - Click month name → Month view
 * - Click year → Year range view
 * - Rock-solid stability - never auto-closes during navigation
 * - DD/MM/YYYY format
 */

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ========================
// Types & Constants
// ========================

type ViewMode = 'date' | 'month' | 'year';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ========================
// Utility Functions
// ========================

function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

// ========================
// Calendar Component
// ========================

interface TailwindCalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

function TailwindCalendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  className,
}: TailwindCalendarProps) {
  const initialDate = selected || new Date();
  const [viewMode, setViewMode] = React.useState<ViewMode>('date');
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth());
  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear());
  const [decadeStart, setDecadeStart] = React.useState(getDecadeStart(initialDate.getFullYear()));

  // Stop all propagation for calendar interactions
  const stopProp = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Date validation
  const isDateDisabled = (date: Date): boolean => {
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (date > max) return true;
    }
    return false;
  };

  // ========================
  // DATE VIEW
  // ========================

  const goToPrevMonth = (e: React.MouseEvent) => {
    stopProp(e);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    stopProp(e);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateSelect = (day: number, e: React.MouseEvent) => {
    stopProp(e);
    const selectedDate = new Date(viewYear, viewMonth, day);
    if (!isDateDisabled(selectedDate)) {
      onSelect(selectedDate);
    }
  };

  const renderDateView = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const calendarDays: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => { stopProp(e); setViewMode('month'); }}
              className="px-2 py-1 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {MONTHS_FULL[viewMonth]}
            </button>
            <button
              type="button"
              onClick={(e) => { stopProp(e); setDecadeStart(getDecadeStart(viewYear)); setViewMode('year'); }}
              className="px-2 py-1 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {viewYear}
            </button>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-8 w-8" />;
            }

            const date = new Date(viewYear, viewMonth, day);
            const isSelected = selected && isSameDay(date, selected);
            const isTodayDate = isToday(date);
            const isDisabled = isDateDisabled(date);

            return (
              <button
                key={`day-${day}`}
                type="button"
                onClick={(e) => handleDateSelect(day, e)}
                disabled={isDisabled}
                className={cn(
                  "h-8 w-8 rounded-md text-sm font-normal transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isTodayDate && !isSelected && "bg-accent text-accent-foreground font-semibold",
                  isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // ========================
  // MONTH VIEW
  // ========================

  const handleMonthSelect = (monthIndex: number, e: React.MouseEvent) => {
    stopProp(e);
    setViewMonth(monthIndex);
    setViewMode('date');
  };

  const renderMonthView = () => {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={(e) => { stopProp(e); setViewYear(viewYear - 1); }}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(e) => { stopProp(e); setDecadeStart(getDecadeStart(viewYear)); setViewMode('year'); }}
            className="px-3 py-1 text-sm font-medium rounded-md hover:bg-accent transition-colors"
          >
            {viewYear}
          </button>

          <button
            type="button"
            onClick={(e) => { stopProp(e); setViewYear(viewYear + 1); }}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Months grid - 4x3 */}
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => {
            const isCurrentMonth = index === new Date().getMonth() && viewYear === new Date().getFullYear();
            const isSelectedMonth = selected && index === selected.getMonth() && viewYear === selected.getFullYear();

            return (
              <button
                key={month}
                type="button"
                onClick={(e) => handleMonthSelect(index, e)}
                className={cn(
                  "h-10 rounded-md text-sm font-normal transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  isSelectedMonth && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isCurrentMonth && !isSelectedMonth && "bg-accent text-accent-foreground font-semibold"
                )}
              >
                {month}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  // ========================
  // YEAR VIEW
  // ========================

  const goToPrevDecade = (e: React.MouseEvent) => {
    stopProp(e);
    setDecadeStart(decadeStart - 10);
  };

  const goToNextDecade = (e: React.MouseEvent) => {
    stopProp(e);
    setDecadeStart(decadeStart + 10);
  };

  const handleYearSelect = (year: number, e: React.MouseEvent) => {
    stopProp(e);
    setViewYear(year);
    setViewMode('month');
  };

  const renderYearView = () => {
    const years: number[] = [];
    for (let i = 0; i < 12; i++) {
      years.push(decadeStart - 1 + i);
    }

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={goToPrevDecade}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium">
            {decadeStart} - {decadeStart + 9}
          </span>

          <button
            type="button"
            onClick={goToNextDecade}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Years grid - 4x3 */}
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const isCurrentYear = year === new Date().getFullYear();
            const isSelectedYear = selected && year === selected.getFullYear();
            const isOutOfRange = year < decadeStart || year > decadeStart + 9;

            return (
              <button
                key={year}
                type="button"
                onClick={(e) => handleYearSelect(year, e)}
                className={cn(
                  "h-10 rounded-md text-sm font-normal transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  isSelectedYear && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isCurrentYear && !isSelectedYear && "bg-accent text-accent-foreground font-semibold",
                  isOutOfRange && "text-muted-foreground"
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div
      className={cn(
        "p-3 bg-popover border border-border rounded-lg shadow-lg min-w-[280px]",
        className
      )}
      onClick={stopProp}
      onMouseDown={stopProp}
      onPointerDown={stopProp}
    >
      {viewMode === 'date' && renderDateView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}
    </div>
  );
}

// ========================
// Date Picker Component
// ========================

interface TailwindDatePickerProps {
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

export function TailwindDatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  disabled = false,
  minDate,
  maxDate,
  minAge,
  className,
  error,
}: TailwindDatePickerProps) {
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

  // Handle date selection - closes calendar
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

    // Delay to prevent immediate close
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
          className="absolute z-[500] mt-1 left-0"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <TailwindCalendar
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

TailwindDatePicker.displayName = "TailwindDatePicker";

// Export calendar separately for custom usage
export { TailwindCalendar };
