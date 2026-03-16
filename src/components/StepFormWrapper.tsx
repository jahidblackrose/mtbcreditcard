import React, { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { StepHeader } from './StepHeader';
import { ValidationSummary } from './FormFieldWrapper';

interface StepFormWrapperProps {
  stepNumber?: number;
  title?: string;
  description?: string;
  hint?: string;
  children: React.ReactNode;
  isSaving?: boolean;
  showValidationSummary?: boolean;
  showHeader?: boolean;
  className?: string;
  form?: UseFormReturn<any>; // Optional form prop for validation features
}

/**
 * Wrapper component for all form steps providing:
 * - Optional header with step number (disabled by default to avoid duplication)
 * - Auto-scroll to first error on validation (if form provided)
 * - Loading/saving state
 * - Validation summary (if form provided)
 * - Consistent animations
 *
 * Note: If form prop is not provided, validation features will be disabled.
 * This allows the wrapper to work both inside and outside FormProvider.
 */
export const StepFormWrapper: React.FC<StepFormWrapperProps> = ({
  stepNumber,
  title,
  description,
  hint,
  children,
  isSaving = false,
  showValidationSummary = true,
  showHeader = false,
  className,
  form,
}) => {
  const errorRef = useRef<HTMLDivElement>(null);

  // Scroll to first error when validation fails (only if form provided)
  useEffect(() => {
    if (form?.formState.isSubmitted && Object.keys(form.formState.errors).length > 0) {
      const firstErrorField = document.querySelector('[data-error="true"]') as HTMLElement;
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  }, [form?.formState.isSubmitted, form?.formState.errors]);

  const errors = form?.formState.errors || {};
  const hasErrors = form && Object.keys(errors).length > 0;
  const isSubmitted = form?.formState.isSubmitted;

  const scrollToFirstError = (fieldName: string) => {
    const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  return (
    <div className={className}>
      {/* Step Header - Only show if explicitly requested */}
      {showHeader && stepNumber && title && (
        <StepHeader
          stepNumber={stepNumber}
          title={title}
          description={description}
          hint={hint}
        />
      )}

      {/* Validation Summary */}
      <AnimatePresence>
        {showValidationSummary && hasErrors && isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 sm:mb-6"
            ref={errorRef}
          >
            <ValidationSummary
              errors={errors}
              onFieldClick={scrollToFirstError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saving Indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 p-2 sm:p-4 bg-accent/10 border border-accent/30 rounded-lg"
          >
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-spin" />
            <div>
              <p className="text-sm sm:text-base font-medium text-accent-foreground">Saving your progress...</p>
              <p className="text-[10px] sm:text-sm text-accent-foreground/80">We're saving your information automatically</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

interface FormSectionProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Form section wrapper for grouping related fields
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  className,
}) => {
  return (
    <div className={className}>
      {(title || description || icon) && (
        <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-gray-200">
          {icon && (
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded bg-accent/10 text-accent">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-[10px] sm:text-xs text-gray-900 mt-0.5">{description}</p>}
          </div>
        </div>
      )}
      <div className="space-y-1.5 sm:space-y-3">
        {children}
      </div>
    </div>
  );
};

interface FieldRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Field row for responsive 2-column layouts
 */
export const FieldRow: React.FC<FieldRowProps> = ({ children, className }) => {
  return (
    <div className={`grid gap-1.5 sm:gap-3 sm:grid-cols-2 ${className || ''}`}>
      {children}
    </div>
  );
};

interface FieldTripleRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Field row for responsive 3-column layouts
 */
export const FieldTripleRow: React.FC<FieldTripleRowProps> = ({ children, className }) => {
  return (
    <div className={`grid gap-1.5 sm:gap-3 sm:grid-cols-3 ${className || ''}`}>
      {children}
    </div>
  );
};
