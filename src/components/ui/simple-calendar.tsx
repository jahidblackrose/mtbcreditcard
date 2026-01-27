/**
 * Simple Bootstrap-Style Calendar
 * 
 * Features:
 * - NO year dropdown scrolling
 * - Month/Year navigation via LEFT/RIGHT arrows only
 * - Rock-solid stability - never auto-closes
 * - DD-MM-YYYY format
 */

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SimpleCalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

export function SimpleCalendar({
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  className,
}: SimpleCalendarProps) {
  // Initialize to selected date's month/year, or current date
  const initialDate = selected || new Date();
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth());
  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear());

  const goToPrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    if (disabled && disabled(date)) return true;
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
    return false;
  };

  const handleDateSelect = (day: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedDate = new Date(viewYear, viewMonth, day);
    if (!isDateDisabled(selectedDate)) {
      onSelect(selectedDate);
    }
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Check if prev/next month buttons should be disabled
  const canGoPrev = !minDate || new Date(viewYear, viewMonth, 1) > minDate;
  const canGoNext = !maxDate || new Date(viewYear, viewMonth + 1, 0) < maxDate;

  return (
    <div 
      className={cn("p-3 bg-background border rounded-md shadow-lg", className)}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7",
            !canGoPrev && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 font-medium text-sm">
          <span>{MONTHS[viewMonth]}</span>
          <span>{viewYear}</span>
        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7",
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
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
    </div>
  );
}

SimpleCalendar.displayName = "SimpleCalendar";
