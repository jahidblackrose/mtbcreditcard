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
      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                // Pill style matching attachment
                'flex-1 py-3.5 px-4 rounded-2xl text-[15px] font-medium',
                'border-2 transition-all duration-200',
                'focus:outline-none',
                isSelected
                  ? 'bg-success/10 border-success text-success'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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
