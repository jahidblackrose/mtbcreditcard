/**
 * Desktop Step Layout - Bootstrap-style 12-grid Layout
 * 
 * For screens > 768px:
 * - MTB branding header with logo and menu
 * - Sidebar stepper (3 columns)
 * - Main content area (9 columns)
 * - Standard Bootstrap-style inputs
 */

import { ReactNode, useEffect, useRef } from 'react';
import { ArrowLeft, Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import mtbLogo from '@/assets/mtb-logo.png';
import { ThemeToggle } from '@/ui/components/ThemeToggle';

interface StepInfo {
  title: string;
  description: string;
  isOptional?: boolean;
}

interface DesktopStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  steps: StepInfo[];
  completedSteps: number[];
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onProceed?: () => void;
  onStepClick?: (step: number) => void;
  proceedLabel?: string;
  proceedDisabled?: boolean;
  isLoading?: boolean;
  showBackButton?: boolean;
}

export function DesktopStepLayout({
  currentStep,
  totalSteps,
  steps,
  completedSteps,
  title,
  description,
  children,
  onBack,
  onProceed,
  onStepClick,
  proceedLabel = 'Continue',
  proceedDisabled = false,
  isLoading = false,
  showBackButton = true,
}: DesktopStepLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top and focus first input on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const timer = setTimeout(() => {
      const firstInput = contentRef.current?.querySelector(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
      ) as HTMLInputElement | null;
      
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* MTB Brand Gradient Bar */}
      <div className="mtb-gradient-bar" />
      
      {/* Header with Logo and Navigation */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={mtbLogo} 
              alt="Mutual Trust Bank PLC" 
              className="h-10 w-auto"
            />
            <span className="text-sm font-medium text-foreground hidden lg:block">
              Credit Card Application
            </span>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="/apply" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Apply Now
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track Application
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content - Bootstrap 12-Grid Style */}
      <div className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Stepper - 3 columns */}
          <aside className="col-span-3 hidden lg:block">
            <div className="sticky top-8 bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Application Progress
              </h3>
              <nav className="space-y-1">
                {steps.map((step, index) => {
                  const stepNum = index + 1;
                  const isActive = stepNum === currentStep;
                  const isCompleted = completedSteps.includes(stepNum);
                  const isClickable = isCompleted || stepNum <= currentStep;
                  
                  return (
                    <button
                      key={stepNum}
                      onClick={() => isClickable && onStepClick?.(stepNum)}
                      disabled={!isClickable}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                        isActive && 'bg-primary/10',
                        isClickable && !isActive && 'hover:bg-muted',
                        !isClickable && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {/* Step indicator */}
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                        'text-xs font-semibold',
                        isCompleted && 'bg-success text-success-foreground',
                        isActive && !isCompleted && 'bg-primary text-primary-foreground',
                        !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                      )}>
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          stepNum
                        )}
                      </div>
                      
                      {/* Step title */}
                      <span className={cn(
                        'text-sm truncate',
                        isActive && 'font-medium text-foreground',
                        !isActive && 'text-muted-foreground'
                      )}>
                        {step.title}
                        {step.isOptional && (
                          <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
          
          {/* Main Form Area - 9 columns on desktop, full on tablet */}
          <main className="col-span-12 lg:col-span-9">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                {showBackButton && onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Progress indicator for tablet */}
              <div className="lg:hidden flex items-center gap-4 mt-4">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {currentStep} of {totalSteps}
                </span>
              </div>
            </div>
            
            {/* Form Content */}
            <div 
              ref={contentRef}
              className="bg-card rounded-xl border border-border p-6 md:p-8"
            >
              {children}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 gap-4">
              {showBackButton && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {onProceed && (
                <button
                  type="button"
                  onClick={onProceed}
                  disabled={proceedDisabled || isLoading}
                  className={cn(
                    'px-8 py-2.5 rounded-lg text-sm font-semibold transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success',
                    'mobile-cta-button hover:brightness-95'
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    proceedLabel
                  )}
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Mutual Trust Bank PLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
