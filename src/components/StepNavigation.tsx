import React from 'react';
import { motion } from 'framer-motion';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isNextLoading?: boolean;
  isSaving?: boolean;
  onBack: () => void;
  onNext: () => void;
  onSave?: () => void;
  onNextText?: string;
  showSave?: boolean;
  errorMessage?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  isNextLoading = false,
  isSaving = false,
  onBack,
  onNext,
  onSave,
  onNextText,
  showSave = true,
  errorMessage
}) => {
  const isLastStep = currentStep === totalSteps;
  const nextButtonText = onNextText || (isLastStep ? 'Submit' : 'Save & Next');
  const nextButtonIcon = isLastStep ? (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      {/* Error Message Banner */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-b border-red-200 px-2 sm:px-3 sm:py-2 py-1.5"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-red-800">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-[9px] sm:text-[10px] font-medium line-clamp-1">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-6 py-1.5 sm:py-2">
        {/* Single row of buttons on all screens */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Back Button */}
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isNextLoading || isSaving}
              className="inline-flex items-center justify-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 max-w-[60px] sm:max-w-[80px]"
              aria-label="Go back to previous step"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              <span className="font-medium truncate">Back</span>
            </button>
          )}

          {/* Save Draft Button */}
          {showSave && onSave && !isLastStep && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isNextLoading}
              className="inline-flex items-center justify-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 max-w-[80px] sm:max-w-[110px]"
              aria-label="Save current draft"
              aria-busy={isSaving}
            >
              {isSaving ? (
                <>
                  <motion.div
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-gray-600 border-t-transparent rounded-full flex-shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    role="status"
                    aria-label="Loading"
                  />
                  <span className="font-medium truncate text-[8px] sm:text-[10px]">Saving</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span className="font-medium truncate text-[8px] sm:text-xs">Save Draft</span>
                </>
              )}
            </button>
          )}

          {/* Save & Next / Submit Button */}
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isNextLoading || isSaving}
            className="inline-flex items-center justify-center space-x-0.5 sm:space-x-1.5 px-2 sm:px-4 py-1.5 sm:py-2.5 text-[9px] sm:text-xs text-white bg-accent border border-transparent rounded-md hover:bg-accent/90 focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 max-w-[90px] sm:max-w-[130px] shadow-sm hover:shadow"
            aria-label={isLastStep ? "Submit application" : "Save and proceed"}
            aria-busy={isNextLoading}
          >
            {isNextLoading ? (
              <>
                <motion.div
                  className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full flex-shrink-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  role="status"
                  aria-label="Loading"
                />
                <span className="font-medium truncate text-[8px] sm:text-[10px]">
                  {isLastStep ? 'Submitting' : 'Loading'}
                </span>
              </>
            ) : (
              <>
                <span className="font-medium truncate">{nextButtonText}</span>
                <span className="hidden sm:inline-flex" aria-hidden="true">{nextButtonIcon}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
