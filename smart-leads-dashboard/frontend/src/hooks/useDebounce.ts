import { useEffect, useState } from 'react';

/**
 * useDebounce — delays updating the returned value until `delay` ms
 * have passed without `value` changing.
 *
 * Generic type T allows usage with any value type (string, number, object, etc.)
 *
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before the delay expires
    // This is the key mechanism that prevents API calls on every keystroke
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
