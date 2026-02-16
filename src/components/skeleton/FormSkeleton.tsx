import React from 'react';

interface FormSkeletonProps {
  fieldCount?: number;
  showHeader?: boolean;
  showActions?: boolean;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fieldCount = 4,
  showHeader = true,
  showActions = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="space-y-3">
          <div className="h-7 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full max-w-lg animate-pulse" />
        </div>
      )}

      {/* Fields */}
      <div className="space-y-5 pt-4">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Label */}
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />

            {/* Input */}
            <div
              className={`h-11 bg-gray-200 rounded animate-pulse ${
                i % 2 === 0 ? 'w-full' : 'w-2/3'
              }`}
            />

            {/* Help text (randomly shown) */}
            {i % 3 === 0 && <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />}
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="h-11 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex space-x-3">
            <div className="h-11 w-28 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-11 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

interface FormFieldSkeletonProps {
  label?: boolean;
  helpText?: boolean;
}

export const FormFieldSkeleton: React.FC<FormFieldSkeletonProps> = ({ label = true, helpText = false }) => {
  return (
    <div className="space-y-2">
      {label && <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />}
      <div className="h-11 bg-gray-200 rounded animate-pulse" />
      {helpText && <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />}
    </div>
  );
};
