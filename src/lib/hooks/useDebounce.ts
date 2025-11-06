import React from 'react';

export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T => {
  const timeoutRef = React.useRef<number | null>(null);

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;
};
