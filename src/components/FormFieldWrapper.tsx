import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

interface EnhancedFormFieldProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  hint?: string;
  warning?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

/**
 * Enhanced Form Field wrapper with consistent UX:
 * - Required field indicator
 * - Optional hint text with icon
 * - Warning message
 * - Consistent styling
 */
export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  name,
  label,
  required = false,
  description,
  hint,
  warning,
  children,
  className,
  labelClassName,
}) => {
  const form = useFormContext();
  const error = form.formState.errors[name];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>{children}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {hint && !error && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">{hint}</p>
            </div>
          )}
          {warning && !error && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{warning}</p>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface FieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Field Group for organizing related fields
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={className}>
      {title && (
        <>
          <h4 className="text-base font-semibold text-gray-900 mb-2">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
        </>
      )}
      {children}
    </div>
  );
};

interface ValidationSummaryProps {
  errors: Record<string, any>;
  onFieldClick?: (fieldName: string) => void;
}

/**
 * Validation summary showing all form errors at the top - MTB branded compact design
 */
export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  onFieldClick,
}) => {
  const errorFields = Object.keys(errors);

  if (errorFields.length === 0) return null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-red-900 mb-1.5">
            Please fix the following error{errorFields.length > 1 ? 's' : ''}:
          </p>
          <ul className="space-y-0.5">
            {errorFields.map((fieldName) => (
              <li key={fieldName}>
                <button
                  type="button"
                  onClick={() => onFieldClick?.(fieldName)}
                  className="text-xs text-red-700 hover:text-red-900 hover:underline text-left"
                >
                  {errors[fieldName]?.message || fieldName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
