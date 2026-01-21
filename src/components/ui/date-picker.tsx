/**
 * Reusable DatePicker component with proper popover behavior
 * Closes automatically after date selection
 */

import * as React from "react";
import { format, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minAge?: number; // Minimum age requirement
  className?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  minAge,
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Calculate max date based on minimum age if provided
  const calculatedMaxDate = React.useMemo(() => {
    if (minAge) {
      return subYears(new Date(), minAge);
    }
    return maxDate;
  }, [minAge, maxDate]);

  const dateValue = React.useMemo(() => {
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
    // Close popover immediately after selection
    setOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (calculatedMaxDate && date > calculatedMaxDate) return true;
    if (minDate && date < minDate) return true;
    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
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
  );
}
