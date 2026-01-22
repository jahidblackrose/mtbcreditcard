/**
 * Mobile Gender Pills - Banking App Style
 * 
 * Horizontal pill buttons for gender selection.
 * Selected: green outline/fill style.
 */

import { cn } from '@/lib/utils';

interface GenderOption {
  value: string;
  label: string;
}

const DEFAULT_GENDERS: GenderOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
];

interface MobileGenderPillsProps {
  value?: string;
  onChange: (value: string) => void;
  options?: GenderOption[];
  label?: string;
  error?: string;
  className?: string;
}

export function MobileGenderPills({
  value,
  onChange,
  options = DEFAULT_GENDERS,
  label,
  error,
  className,
}: MobileGenderPillsProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-2 px-1">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl text-sm font-medium',
                'border transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-success/30',
                isSelected
                  ? 'bg-success/15 border-success text-success'
                  : 'bg-card border-border/50 text-foreground/70 hover:border-border'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1.5 px-1">{error}</p>
      )}
    </div>
  );
}
