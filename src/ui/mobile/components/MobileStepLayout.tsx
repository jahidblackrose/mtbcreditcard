/**
 * Mobile Step Layout - Premium Banking Style
 * 
 * Navy-themed step navigation with clean, secure feel.
 */

import { ReactNode, useEffect, useRef, forwardRef } from 'react';
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

export const MobileStepLayout = forwardRef<HTMLDivElement, MobileStepLayoutProps>(
  function MobileStepLayout({
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
  }, ref) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
      <div ref={ref} className={cn('min-h-screen flex flex-col bg-background', className)}>
        {/* Thin Brand Accent */}
        <div className="mtb-gradient-bar" />
        
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 safe-area-top">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            {showBackButton && onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
            ) : (
              <div className="w-9" />
            )}

            {/* Progress Bar */}
            <div className="flex-1 max-w-[200px]">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Step Counter */}
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="px-4 pt-5 pb-2">
          <h1 className="text-xl font-bold text-foreground tracking-tight">
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

        {/* Sticky Bottom CTA - Navy solid button */}
        {onProceed && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-5 py-4 safe-area-bottom">
            <button
              type="button"
              onClick={onProceed}
              disabled={proceedDisabled || isLoading}
              className={cn(
                'w-full py-3.5 rounded-xl text-base font-semibold transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                'active:scale-[0.98]',
                'mobile-cta-button'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-primary-foreground" viewBox="0 0 24 24">
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
);

MobileStepLayout.displayName = 'MobileStepLayout';
