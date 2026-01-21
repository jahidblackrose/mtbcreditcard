/**
 * MTB Credit Card Application - Step Progress Tracker
 * 
 * Shows step completion status with version indicators.
 */

import { Check, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DraftVersion } from '@/types/session.types';

interface Step {
  number: number;
  name: string;
  shortName: string;
  isOptional?: boolean;
}

interface StepProgressTrackerProps {
  steps: Step[];
  currentStep: number;
  highestCompletedStep: number;
  stepVersions: DraftVersion[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepProgressTracker({
  steps,
  currentStep,
  highestCompletedStep,
  stepVersions,
  onStepClick,
  className,
}: StepProgressTrackerProps) {
  const getStepStatus = (stepNumber: number): 'completed' | 'current' | 'pending' | 'locked' => {
    const version = stepVersions.find(v => v.stepNumber === stepNumber);
    if (version?.isComplete) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (stepNumber <= highestCompletedStep + 1) return 'pending';
    return 'locked';
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {steps.map((step) => {
        const status = getStepStatus(step.number);
        const version = stepVersions.find(v => v.stepNumber === step.number);
        const isClickable = onStepClick && (status === 'completed' || status === 'current' || status === 'pending');

        return (
          <button
            key={step.number}
            onClick={() => isClickable && onStepClick(step.number)}
            disabled={!isClickable}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
              status === 'current' && 'bg-primary/10 text-primary',
              status === 'completed' && 'bg-success/5 hover:bg-success/10',
              status === 'pending' && 'hover:bg-muted',
              status === 'locked' && 'cursor-not-allowed opacity-50',
              isClickable && status !== 'current' && 'cursor-pointer'
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                status === 'completed' && 'bg-success text-success-foreground',
                status === 'current' && 'bg-primary text-primary-foreground',
                status === 'pending' && 'border-2 border-muted-foreground/30 text-muted-foreground',
                status === 'locked' && 'border-2 border-muted text-muted'
              )}
            >
              {status === 'completed' ? (
                <Check className="h-3 w-3" />
              ) : status === 'locked' ? (
                <Lock className="h-3 w-3" />
              ) : (
                step.number
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium truncate',
                  status === 'locked' && 'text-muted-foreground'
                )}
              >
                {step.shortName}
                {step.isOptional && (
                  <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>
                )}
              </p>
              {version && status === 'completed' && (
                <p className="text-xs text-muted-foreground">
                  v{version.version} saved
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
