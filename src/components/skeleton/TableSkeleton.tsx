import React from 'react';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showHeader?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rowCount = 5,
  columnCount = 4,
  showHeader = true,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-t-lg">
          {Array.from({ length: columnCount }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-300 rounded animate-pulse"
              style={{ width: `${Math.max(10, 30 - i * 5)}%` }}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center space-x-3 px-4 py-4 border border-gray-100 rounded-lg">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 rounded animate-pulse"
                style={{
                  width: `${Math.max(10, 30 - colIndex * 5)}%`,
                  animationDelay: `${(rowIndex * columnCount + colIndex) * 0.05}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
