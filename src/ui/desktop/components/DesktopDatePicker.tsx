/**
 * Desktop Date Picker - Bootstrap-style with Calendar popup
 * 
 * Standard web form date picker with:
 * - White background, light gray border
 * - Green border on focus (MTB theme)
 * - Calendar popup
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

export function DesktopDatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  error,
  helperText,
  minDate,
  maxDate,
  disabled = false,
}: DesktopDatePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              'bg-white border-input hover:bg-white hover:border-muted-foreground/50',
              'px-4 py-2.5 h-auto text-sm',
              'focus:ring-2 focus:ring-success/30 focus:border-success',
              !value && 'text-muted-foreground',
              error && 'border-destructive focus:ring-destructive/30 focus:border-destructive'
            )}
          >
            {value ? format(value, 'PPP') : placeholder}
            <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>
      {helperText && !error && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
