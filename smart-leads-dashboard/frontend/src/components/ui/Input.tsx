import React, { forwardRef } from 'react';

// ── Input Component ─────────────────────────────────────────────────────────
// Wraps a native <input> with a label, error message, and consistent styling.

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, leftIcon, rightElement, className = '', id, ...props },
    ref
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {/* Left icon (e.g., search, email) */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={[
              'w-full rounded-lg border text-sm transition-colors duration-200',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              // Error state vs default border
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-gray-300 dark:border-gray-700 focus:ring-brand-500',
              leftIcon ? 'pl-10' : 'pl-3',
              rightElement ? 'pr-10' : 'pr-3',
              'py-2.5',
              'disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60',
              className,
            ].join(' ')}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* Right element (e.g., show/hide password toggle) */}
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {/* Field-level error message */}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 mt-0.5" role="alert">
            {error}
          </p>
        )}

        {/* Helper text when no error */}
        {helperText && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
