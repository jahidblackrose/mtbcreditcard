import React from 'react';
import { motion } from 'framer-motion';

export interface StatusStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  estimatedCompletion?: Date;
}

interface StatusProgressProps {
  steps: StatusStep[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showDescriptions?: boolean;
  className?: string;
}

export const StatusProgress: React.FC<StatusProgressProps> = ({
  steps,
  orientation = 'horizontal',
  size = 'md',
  showDescriptions = false,
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          circle: 'w-6 h-6 text-xs',
          line: 'h-0.5',
          label: 'text-xs',
        };
      case 'lg':
        return {
          circle: 'w-12 h-12 text-lg',
          line: 'h-1',
          label: 'text-base',
        };
      default:
        return {
          circle: 'w-8 h-8 text-sm',
          line: 'h-0.5',
          label: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getStepStatus = (step: StatusStep, index: number) => {
    if (step.status === 'error') return 'error';
    if (step.status === 'current') return 'current';
    if (step.status === 'completed') return 'completed';
    return 'pending';
  };

  const getCircleClasses = (status: string) => {
    const baseClasses = `${sizeClasses.circle} rounded-full flex items-center justify-center font-semibold transition-all duration-300`;

    switch (status) {
      case 'error':
        return `${baseClasses} bg-red-100 text-red-600 border-2 border-red-300`;
      case 'current':
        return `${baseClasses} bg-blue-600 text-white border-2 border-blue-600 shadow-lg`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-600 border-2 border-green-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-500 border-2 border-gray-300`;
    }
  };

  const getLineClasses = (fromStatus: string, toStatus: string) => {
    const baseClasses = `${sizeClasses.line} flex-1 transition-all duration-500`;

    if (fromStatus === 'completed' && (toStatus === 'completed' || toStatus === 'current' || toStatus === 'error')) {
      return `${baseClasses} bg-green-400`;
    }
    if (fromStatus === 'error') {
      return `${baseClasses} bg-red-300`;
    }
    return `${baseClasses} bg-gray-200`;
  };

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 -ml-px">
                  {status === 'completed' && (
                    <motion.div
                      className="w-full bg-green-400"
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Step Circle */}
                <div className={getCircleClasses(status)}>
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === 'error' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center space-x-2">
                    <p className={`font-semibold ${status === 'current' ? 'text-blue-600' : 'text-gray-900'} ${sizeClasses.label}`}>
                      {step.label}
                    </p>
                    {status === 'current' && (
                      <motion.span
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        In Progress
                      </motion.span>
                    )}
                  </div>

                  {showDescriptions && step.description && (
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  )}

                  {step.estimatedCompletion && status !== 'completed' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Est. completion: {step.estimatedCompletion.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const nextStep = steps[index + 1];
          const nextStatus = nextStep ? getStepStatus(nextStep, index + 1) : null;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div className={getCircleClasses(status)}>
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === 'error' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p className={`font-medium ${status === 'current' ? 'text-blue-600' : 'text-gray-900'} ${sizeClasses.label}`}>
                    {step.label}
                  </p>
                  {showDescriptions && step.description && (
                    <p className={`text-xs text-gray-600 mt-0.5 max-w-[120px] hidden sm:block`}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={getLineClasses(status, nextStatus || 'pending')} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
