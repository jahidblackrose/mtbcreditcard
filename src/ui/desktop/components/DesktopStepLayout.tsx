/**
 * Desktop Step Layout - Premium Banking Dashboard
 * 
 * Navy-themed with collapsible sidebar stepper, clean card layout.
 */

import { ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Brand Line */}
      <div className="mtb-gradient-bar" />
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={mtbLogo} 
              alt="Mutual Trust Bank PLC" 
              className="h-9 w-auto"
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                Credit Card Application
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Mutual Trust Bank PLC
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </a>
            <a href="/apply" className="text-sm font-medium text-primary transition-colors">
              Apply Now
            </a>
            <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track Application
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar Stepper */}
          <aside className={cn(
            "hidden lg:block transition-all duration-300",
            sidebarOpen ? "col-span-3" : "col-span-1"
          )}>
            <div className="sticky top-8">
              {/* Toggle */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {sidebarOpen ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span>Hide Progress</span>
                  </>
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>
              
              {/* Sidebar Content */}
              <div className={cn(
                "bg-card rounded-xl border border-border overflow-hidden transition-all duration-300",
                sidebarOpen ? "p-5" : "p-3"
              )}>
                {sidebarOpen ? (
                  <>
                    <h3 className="text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-widest">
                      Application Progress
                    </h3>
                    <nav className="space-y-0.5">
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
                              isActive && 'bg-primary/8 border-l-2 border-primary',
                              isClickable && !isActive && 'hover:bg-muted',
                              !isClickable && 'opacity-40 cursor-not-allowed'
                            )}
                          >
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                              'text-[11px] font-semibold',
                              isCompleted && 'bg-success text-success-foreground',
                              isActive && !isCompleted && 'bg-primary text-primary-foreground',
                              !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                            )}>
                              {isCompleted ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                stepNum
                              )}
                            </div>
                            
                            <span className={cn(
                              'text-[13px] truncate',
                              isActive && 'font-medium text-foreground',
                              !isActive && 'text-muted-foreground'
                            )}>
                              {step.title}
                              {step.isOptional && (
                                <span className="text-[10px] text-muted-foreground ml-1">(Optional)</span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </nav>
                  </>
                ) : (
                  <nav className="space-y-2">
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
                          title={step.title}
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center mx-auto',
                            'text-[11px] font-semibold transition-all',
                            isCompleted && 'bg-success text-success-foreground',
                            isActive && !isCompleted && 'bg-primary text-primary-foreground',
                            !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                            !isClickable && 'opacity-40 cursor-not-allowed'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            stepNum
                          )}
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            </div>
          </aside>
          
          {/* Main Form Area */}
          <main className={cn(
            "col-span-12 transition-all duration-300",
            sidebarOpen ? "lg:col-span-9" : "lg:col-span-11"
          )}>
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
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
                  <h1 className="text-xl font-bold text-foreground">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Progress for tablet / hidden sidebar */}
              <div className={cn(
                "flex items-center gap-4 mt-4",
                sidebarOpen ? "lg:hidden" : ""
              )}>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            </div>
            
            {/* Form Card */}
            <div 
              ref={contentRef}
              className="bg-card rounded-xl border border-border p-6 lg:p-8 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]"
            >
              <div className="max-w-4xl">
                {children}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6 gap-4">
              {showBackButton && onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
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
                    'px-8 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                    'mobile-cta-button'
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
      
      <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground bg-card">
        <p>© 2024 Mutual Trust Bank PLC. All rights reserved.</p>
      </footer>
    </div>
  );
}
