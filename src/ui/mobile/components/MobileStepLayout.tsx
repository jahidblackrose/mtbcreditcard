/**
 * Mobile Step Layout - Banking App Style
 * 
 * Provides consistent layout for all application steps:
 * - Sticky top bar with back, progress, step counter
 * - Page header with title and description
 * - Content area
 * - Sticky bottom CTA button
 */

import { ReactNode, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onProceed?: () => void;
  proceedLabel?: string;
  proceedDisabled?: boolean;
  isLoading?: boolean;
  showBackButton?: boolean;
  className?: string;
}

export function MobileStepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onBack,
  onProceed,
  proceedLabel = 'Proceed',
  proceedDisabled = false,
  isLoading = false,
  showBackButton = true,
  className,
}: MobileStepLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to top and focus first input on mount
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus first input after a short delay for DOM to settle
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

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('min-h-screen flex flex-col bg-mobile-background', className)}>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-mobile-background px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          {showBackButton && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
          ) : (
            <div className="w-9" /> // Spacer
          )}

          {/* Progress Bar */}
          <div className="flex-1 max-w-[200px]">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Counter */}
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {currentStep} OF {totalSteps}
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Content Area */}
      <div 
        ref={contentRef}
        className="flex-1 px-4 pb-32 overflow-y-auto"
      >
        {children}
      </div>

      {/* Sticky Bottom CTA */}
      {onProceed && (
        <div className="fixed bottom-0 left-0 right-0 bg-mobile-background border-t border-border px-4 py-4 safe-area-bottom">
          <button
            type="button"
            onClick={onProceed}
            disabled={proceedDisabled || isLoading}
            className={cn(
              'w-full py-4 rounded-full text-base font-semibold transition-all',
              'bg-success/20 text-success-foreground',
              'hover:bg-success/30 active:bg-success/40',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2'
            )}
            style={{
              backgroundColor: 'hsl(var(--success) / 0.15)',
              color: 'hsl(145 63% 25%)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              proceedLabel
            )}
          </button>
        </div>
      )}
    </div>
  );
}
