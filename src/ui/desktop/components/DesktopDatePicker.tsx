/**
 * Desktop Date Picker - Bootstrap-style with Calendar popup
 * 
 * Standard web form date picker with:
 * - White background, light gray border
 * - Green border on focus (MTB theme)
 * - Calendar popup
 * - DD-MM-YYYY format
 */

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePopoverCloseGuard } from '@/hooks/usePopoverCloseGuard';

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
  placeholder = 'DD-MM-YYYY',
  error,
  helperText,
  minDate,
  maxDate,
  disabled = false,
}: DesktopDatePickerProps) {
  const [open, setOpen] = useState(false);
  const { markInteracting, shouldIgnoreClose, resetInteracting, preventOutsideClose } = usePopoverCloseGuard(3000);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    resetInteracting();
    setOpen(false);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <Popover
        open={open}
        onOpenChange={(v) => {
          if (shouldIgnoreClose(v)) return;
          setOpen(v);
        }}
      >
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
            {value ? `${String(value.getDate()).padStart(2, '0')}-${String(value.getMonth() + 1).padStart(2, '0')}-${value.getFullYear()}` : placeholder}
            <CalendarIcon className="ml-auto h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          onPointerDownCapture={markInteracting}
          onWheelCapture={markInteracting}
          onKeyDownCapture={markInteracting}
          onPointerDownOutside={preventOutsideClose}
          onFocusOutside={preventOutsideClose}
          onInteractOutside={preventOutsideClose}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
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
