import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * EmptyState — shown when a data list has zero results.
 * Accepts custom messages to differentiate "no data" vs "no search results".
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {/* Icon area */}
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-600">
        {icon ?? <SearchX size={28} />}
      </div>

      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {message}
      </h3>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
