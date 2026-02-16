import React from 'react';
import { motion } from 'framer-motion';

interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  applicationId?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
  mode?: 'SELF' | 'ASSISTED' | 'SUPPLEMENTARY';
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  applicationId,
  isSaving = false,
  lastSaved,
  mode = 'SELF'
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getModeBadgeColor = () => {
    switch (mode) {
      case 'ASSISTED':
        return 'bg-accent/20 text-accent-foreground border-accent/40';
      case 'SUPPLEMENTARY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm" role="banner">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Application progress: Step ${currentStep} of ${totalSteps}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent/80"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Step Info */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-accent text-white font-bold text-sm sm:text-lg shadow-md">
              {currentStep}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">{stepTitle}</h1>
                <span className={`hidden sm:inline-flex px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full border ${getModeBadgeColor()}`}>
                  {mode}
                </span>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Right: Save Status & App ID */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Application ID - hidden on mobile */}
            {applicationId && (
              <div className="hidden sm:block text-right">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Application ID</p>
                <p className="text-xs sm:text-sm font-mono font-semibold text-gray-900">{applicationId.slice(0, 8)}...</p>
              </div>
            )}

            {/* Save Status - Icon only on mobile */}
            <div className="flex items-center space-x-1 sm:space-x-2" aria-live="polite" aria-atomic="true">
              {isSaving ? (
                <div className="flex items-center space-x-1 sm:space-x-2 text-blue-600">
                  <motion.div
                    className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    role="status"
                    aria-label="Saving"
                  />
                  <span className="text-[10px] sm:text-sm font-medium hidden sm:inline">Saving...</span>
                </div>
              ) : lastSaved ? (
                <div className="flex items-center space-x-1 sm:space-x-1.5 text-gray-600">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[10px] sm:text-sm hidden sm:inline">Saved {formatLastSaved(lastSaved)}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-1.5 text-gray-400">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span className="text-[10px] sm:text-sm hidden sm:inline">Draft</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
