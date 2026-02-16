import React from 'react';
import { motion } from 'framer-motion';

interface ApplicationCardSkeletonProps {
  count?: number;
}

export const ApplicationCardSkeleton: React.FC<ApplicationCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Body */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};
