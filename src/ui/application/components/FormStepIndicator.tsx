/**
 * MTB Credit Card Application - Step Indicator
 * 
 * Visual stepper showing progress through the form.
 */

import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APPLICATION_STEPS } from '@/types/application-form.types';

interface FormStepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function FormStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: FormStepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop view - horizontal */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {APPLICATION_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index + 1);
            const isCurrent = currentStep === index + 1;
            const isClickable = isCompleted || index + 1 <= currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick?.(index + 1)}
                    disabled={!isClickable}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isCompleted && 'bg-success text-success-foreground',
                      isCurrent && !isCompleted && 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                      !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                      isClickable && 'cursor-pointer hover:scale-110',
                      !isClickable && 'cursor-not-allowed',
                      step.isOptional && !isCompleted && !isCurrent && 'border-2 border-dashed border-muted-foreground/50'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.stepNumber
                    )}
                  </button>
                  {index < APPLICATION_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-0.5 mx-1',
                        isCompleted ? 'bg-success' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1 text-center max-w-[60px] leading-tight',
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet view - 2 rows */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-6 gap-2">
          {APPLICATION_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index + 1);
            const isCurrent = currentStep === index + 1;
            const isClickable = isCompleted || index + 1 <= currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick?.(index + 1)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all',
                  isCurrent && 'bg-primary/10',
                  isClickable && 'cursor-pointer hover:bg-muted',
                  !isClickable && 'cursor-not-allowed opacity-60'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                    isCompleted && 'bg-success text-success-foreground',
                    isCurrent && !isCompleted && 'bg-primary text-primary-foreground',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                    step.isOptional && !isCompleted && !isCurrent && 'border-2 border-dashed'
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : step.stepNumber}
                </div>
                <span
                  className={cn(
                    'text-[9px] mt-1 text-center leading-tight',
                    isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile view - compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                'bg-primary text-primary-foreground'
              )}
            >
              {currentStep}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {APPLICATION_STEPS[currentStep - 1]?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep} of {APPLICATION_STEPS.length}
              </p>
            </div>
          </div>
          
          {/* Mini progress dots */}
          <div className="flex gap-1">
            {APPLICATION_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(index + 1);
              const isCurrent = currentStep === index + 1;
              
              return (
                <Circle
                  key={step.id}
                  className={cn(
                    'h-2 w-2',
                    isCompleted && 'fill-success text-success',
                    isCurrent && !isCompleted && 'fill-primary text-primary',
                    !isCompleted && !isCurrent && 'fill-muted text-muted'
                  )}
                />
              );
            })}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / APPLICATION_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
