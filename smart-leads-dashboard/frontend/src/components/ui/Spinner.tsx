import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Center horizontally and vertically in its container */
  center?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

/**
 * Spinner — Tailwind-animated loading indicator.
 * Use `center` prop to center within a full-height container.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  center = false,
}) => {
  const spinner = (
    <div
      role="status"
      aria-label="Loading"
      className={[
        'rounded-full border-gray-200 dark:border-gray-700',
        'border-t-brand-500 animate-spin',
        sizeClasses[size],
        className,
      ].join(' ')}
    />
  );

  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};
