import React from 'react';
import { Info } from 'lucide-react';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  description?: string;
  hint?: string;
  totalSteps?: number;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber,
  title,
  description,
  hint,
  totalSteps = 12,
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      {/* Step indicator with progress */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent text-white font-bold text-[10px] sm:text-sm">
            {stepNumber}
          </div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            <span className="hidden sm:inline">Step </span>
            {title}
          </h2>
        </div>
        <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
          {stepNumber}/{totalSteps}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-900 text-[10px] sm:text-xs mb-2 ml-7 sm:ml-9">{description}</p>
      )}

      {/* Helpful hint box - Compact */}
      {hint && (
        <div className="ml-0 sm:ml-9 flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-accent/10 border border-accent/30 rounded text-[10px] sm:text-xs">
          <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-gray-900 font-medium leading-tight">{hint}</p>
        </div>
      )}
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        {icon && <div className="text-accent">{icon}</div>}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {description && (
        <p className="text-xs text-gray-900 ml-6">{description}</p>
      )}
      <div className="h-px bg-gray-200 mt-2" />
    </div>
  );
};
