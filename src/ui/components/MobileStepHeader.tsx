/**
 * MTB Credit Card Application - Mobile Step Header
 * 
 * Compact step indicator for mobile with dropdown navigation.
 */

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { StepInfo, StepStatus } from './StepSidebar';

interface MobileStepHeaderProps {
  steps: StepInfo[];
  currentStep: number;
  stepStatuses: Record<number, StepStatus>;
  onStepClick: (stepNumber: number) => void;
}

export function MobileStepHeader({
  steps,
  currentStep,
  stepStatuses,
  onStepClick,
}: MobileStepHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentStepInfo = steps.find(s => s.stepNumber === currentStep);
  
  const completedCount = Object.values(stepStatuses).filter(s => s.isCompleted).length;
  const progressPercent = (completedCount / steps.length) * 100;
  
  return (
    <div className="bg-card border-b border-border px-4 py-3">
      {/* Step selector */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between h-auto py-2 px-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {currentStep}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {currentStepInfo?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-w-md">
          {steps.map((step) => {
            const status = stepStatuses[step.stepNumber] || { isCompleted: false, isUpdated: false };
            const isCurrent = currentStep === step.stepNumber;
            
            return (
              <DropdownMenuItem
                key={step.id}
                onClick={() => {
                  onStepClick(step.stepNumber);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 py-2.5',
                  isCurrent && 'bg-primary/5'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                    status.isCompleted && 'bg-success text-success-foreground',
                    isCurrent && !status.isCompleted && 'bg-primary text-primary-foreground',
                    !status.isCompleted && !isCurrent && 'bg-muted text-muted-foreground',
                  )}
                >
                  {status.isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    step.stepNumber
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-sm',
                      isCurrent && 'font-medium text-primary',
                      !isCurrent && 'text-foreground'
                    )}>
                      {step.title}
                    </span>
                    {step.isOptional && (
                      <span className="text-[10px] text-muted-foreground">
                        (Optional)
                      </span>
                    )}
                  </div>
                  {status.isUpdated && (
                    <span className="text-[10px] text-success">Updated</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Step dots */}
      <div className="flex justify-center gap-1 mt-2">
        {steps.map((step) => {
          const status = stepStatuses[step.stepNumber] || { isCompleted: false, isUpdated: false };
          const isCurrent = currentStep === step.stepNumber;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.stepNumber)}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                status.isCompleted && 'bg-success',
                isCurrent && !status.isCompleted && 'bg-primary',
                !status.isCompleted && !isCurrent && 'bg-muted-foreground/30',
              )}
              title={step.title}
            />
          );
        })}
      </div>
    </div>
  );
}