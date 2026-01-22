/**
 * Mobile Radio Card List - Banking App Style
 * 
 * Each option is a rounded rectangle row with radio circle.
 * Selected state: green border + selected radio.
 */

import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface MobileRadioCardListProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export function MobileRadioCardList({
  options,
  value,
  onChange,
  label,
  error,
  className,
}: MobileRadioCardListProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-2 px-1">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                // White background, rounded like attachment
                'w-full flex items-center gap-4 p-4 rounded-2xl',
                'bg-white border-2 transition-all duration-200',
                'text-left',
                isSelected
                  ? 'border-success'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {/* Radio Circle - Green when selected */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  'transition-all duration-200',
                  isSelected
                    ? 'border-success bg-success'
                    : 'border-gray-300'
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              
              {/* Label */}
              <div className="flex-1">
                <span className={cn(
                  'text-[15px] font-medium',
                  isSelected ? 'text-foreground' : 'text-gray-600'
                )}>
                  {option.label}
                </span>
                {option.description && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
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
