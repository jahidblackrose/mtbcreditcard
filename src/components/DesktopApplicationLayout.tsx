/**
 * MTB Professional Desktop Application Layout
 * Compact design with MTB brand colors
 */

import React from 'react';
import { Check, ChevronRight, Circle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { APPLICATION_STEPS } from '@/types/application-form.types';

// MTB Brand Colors
const MTB_BLUE = '#0046BE';
const MTB_BLUE_LIGHT = '#0055A4';
const MTB_GREEN = '#00A651';
const MTB_GREEN_DARK = '#00843D';

interface DesktopSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function DesktopSidebar({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: DesktopSidebarProps) {
  return (
    <div className={cn(
      "w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
      className
    )}>
      {/* Compact Header - Secondary/Gray */}
      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
        <h2 className="text-[10px] sm:text-sm font-bold text-gray-900">Application Steps</h2>
        <p className="text-[8px] sm:text-xs text-gray-600 mt-0.5">
          Step {currentStep} of {APPLICATION_STEPS.length}
        </p>
      </div>

      {/* Compact Progress Bar */}
      <div className="h-0.5 bg-gray-200">
        <motion.div
          className="h-full bg-gray-600"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / APPLICATION_STEPS.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps List - Compact */}
      <div className="p-1.5 sm:p-2 space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto">
        {APPLICATION_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isClickable = onStepClick && (isCompleted || stepNumber < currentStep);

          return (
            <button
              key={stepNumber}
              onClick={() => isClickable && onStepClick(stepNumber)}
              disabled={!isClickable}
              className={cn(
                "w-full flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-left transition-all",
                "group relative",
                // Active state - Distinct color (amber/gold to stand out from green)
                isCurrent && "bg-amber-50 border border-amber-200",
                // Completed - Green
                isCompleted && !isCurrent && "bg-accent/10 hover:bg-accent/20",
                // Pending - Gray
                !isCompleted && !isCurrent && "hover:bg-gray-50",
                !isClickable && "cursor-not-allowed opacity-50",
                isClickable && "cursor-pointer"
              )}
            >
              {/* Active indicator - Amber/Gold to stand out */}
              {isCurrent && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500" />
              )}

              {/* Step Icon */}
              <div className={cn(
                "flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-colors",
                // Active - Amber/Gold (distinct from green)
                isCurrent && "border-amber-500 bg-amber-500 text-white",
                // Completed - Green
                isCompleted && !isCurrent && "border-accent bg-accent text-white",
                // Pending - Gray
                !isCompleted && !isCurrent && "border-gray-300 bg-transparent text-gray-400",
                isClickable && !isCurrent && "group-hover:border-gray-400"
              )}>
                {isCompleted ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : isCurrent ? (
                  <span className="text-[10px] sm:text-xs font-bold">{stepNumber}</span>
                ) : (
                  <Circle className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[10px] sm:text-xs font-medium truncate",
                  // Active - Amber/Orange (distinct from green)
                  isCurrent && "text-amber-700 font-semibold",
                  // Completed - Green
                  isCompleted && !isCurrent && "text-accent/90",
                  // Pending - Gray
                  !isCompleted && !isCurrent && "text-gray-700"
                )}>
                  {step.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-gray-600">
            {completedSteps.length}/{APPLICATION_STEPS.length} completed
          </span>
          <span className={cn(
            "font-semibold",
            completedSteps.length === APPLICATION_STEPS.length && "text-[#00A651]"
          )}>
            {Math.round((completedSteps.length / APPLICATION_STEPS.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface DesktopApplicationLayoutProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stepTitle: string;
  stepDescription?: string;
  applicationId?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
  mode?: string;
  onLogout?: () => void;
  onStepClick?: (step: number) => void;
  children: React.ReactNode;
  navigation?: React.ReactNode;
}

export function DesktopApplicationLayout({
  currentStep,
  totalSteps,
  completedSteps,
  stepTitle,
  stepDescription,
  applicationId,
  isSaving,
  lastSaved,
  mode,
  onLogout,
  onStepClick,
  children,
  navigation,
}: DesktopApplicationLayoutProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2">
          <div className="flex items-center justify-between h-9 sm:h-12">
            {/* Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-accent to-accent/80 rounded flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-[10px] sm:text-sm">MTB</span>
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-gray-900">Credit Card Application</h1>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={cn(
                    "px-1 py-0.5 rounded text-[8px] sm:text-[10px] font-semibold",
                    mode === 'ASSISTED' ? "bg-purple-100 text-purple-700" : "bg-accent/10 text-accent"
                  )}>
                    {mode === 'ASSISTED' ? 'Assisted' : 'Self Service'}
                  </span>
                  {applicationId && (
                    <span className="text-[8px] sm:text-[10px] text-gray-500 hidden sm:inline">
                      ID: {applicationId.slice(0, 6)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Save Status */}
            <div className="flex items-center">
              {isSaving ? (
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-accent bg-accent/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving</span>
                </div>
              ) : lastSaved && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00A651] bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{formatLastSaved(lastSaved)}</span>
                </div>
              )}
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 h-8 px-2 sm:px-3 ml-2 sm:ml-3 rounded-md transition-colors cursor-pointer"
                style={{ zIndex: 100, position: 'relative' }}
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="grid grid-cols-12 gap-2 sm:gap-4">
          {/* Sidebar */}
          <div className="col-span-4 lg:col-span-3">
            <DesktopSidebar
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepClick}
              className="sticky top-16 sm:top-20"
            />
          </div>

          {/* Main Form */}
          <div className="col-span-8 lg:col-span-9">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Compact Header - Matching new design */}
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent text-white font-bold text-[10px] sm:text-xs">
                        {currentStep}
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900">{stepTitle}</h2>
                    </div>
                    {stepDescription && (
                      <p className="text-[10px] sm:text-xs text-gray-900 mt-0.5 ml-7 sm:ml-8">{stepDescription}</p>
                    )}
                  </div>
                  <div className="px-2 py-1 bg-accent/10 rounded flex-shrink-0">
                    <span className="text-[10px] sm:text-xs font-semibold text-accent">
                      {currentStep}/{totalSteps}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3 sm:px-5 sm:py-4">
                {children}
              </div>

              {/* Navigation Footer */}
              {navigation && (
                <div className="px-4 py-2 sm:px-5 sm:py-3 bg-gray-50 border-t border-gray-200">
                  {navigation}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
