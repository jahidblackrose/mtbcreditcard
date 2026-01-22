/**
 * MTB Credit Card Application - Step Sidebar Navigation
 * 
 * Vertical stepper sidebar for desktop showing all steps with status.
 * Allows clicking on any step to navigate and update.
 */

import { Check, Circle, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepInfo {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  isOptional: boolean;
}

export interface StepStatus {
  isCompleted: boolean;
  isUpdated: boolean; // Shows if step was revisited and updated
}

interface StepSidebarProps {
  steps: StepInfo[];
  currentStep: number;
  stepStatuses: Record<number, StepStatus>;
  onStepClick: (stepNumber: number) => void;
  className?: string;
}

export function StepSidebar({
  steps,
  currentStep,
  stepStatuses,
  onStepClick,
  className,
}: StepSidebarProps) {
  return (
    <nav className={cn('flex flex-col gap-1', className)}>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-3">
        Application Steps
      </h2>
      
      {steps.map((step) => {
        const status = stepStatuses[step.stepNumber] || { isCompleted: false, isUpdated: false };
        const isCurrent = currentStep === step.stepNumber;
        const isClickable = true; // Allow clicking any step
        
        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick(step.stepNumber)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
              'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isCurrent && 'bg-primary/10 border-l-4 border-primary',
              !isCurrent && 'border-l-4 border-transparent',
              status.isCompleted && !isCurrent && 'hover:bg-success/5',
            )}
          >
            {/* Step indicator circle */}
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                status.isCompleted && 'bg-success text-success-foreground',
                isCurrent && !status.isCompleted && 'bg-primary text-primary-foreground',
                !status.isCompleted && !isCurrent && 'bg-muted text-muted-foreground border border-border',
              )}
            >
              {status.isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.stepNumber
              )}
            </div>
            
            {/* Step title and status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    'text-sm font-medium truncate',
                    isCurrent && 'text-primary',
                    status.isCompleted && !isCurrent && 'text-foreground',
                    !status.isCompleted && !isCurrent && 'text-muted-foreground',
                  )}
                >
                  {step.title}
                </p>
                {step.isOptional && (
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                )}
              </div>
              
              {/* Updated indicator */}
              {status.isCompleted && status.isUpdated && (
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-success font-medium">Updated</span>
                </div>
              )}
            </div>
            
            {/* Edit icon for completed steps */}
            {status.isCompleted && !isCurrent && (
              <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        );
      })}
    </nav>
  );
}