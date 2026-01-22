/**
 * Mobile Checkbox - Banking App Style
 * 
 * Green checkmark style matching the attachment.
 */

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export function MobileCheckbox({
  checked,
  onChange,
  label,
  className,
}: MobileCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-3 w-full py-2 text-left',
        className
      )}
    >
      {/* Checkbox Square */}
      <div
        className={cn(
          'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0',
          'transition-all duration-200',
          checked
            ? 'bg-success border-success'
            : 'bg-white border-gray-300'
        )}
      >
        {checked && (
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        )}
      </div>
      
      {/* Label */}
      <span className="text-[15px] text-foreground">
        {label}
      </span>
    </button>
  );
}
