import { useState, useEffect } from 'react';

/**
 * 특정 값의 변경을 지연시켜 처리하는 디바운스 훅입니다.
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}