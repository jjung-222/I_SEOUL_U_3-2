import { useState, useEffect } from 'react';

/**
 * 로컬 스토리지와 상태를 동기화하는 커스텀 훅입니다.
 * @param key 로컬 스토리지에 사용할 키
 * @param initialValue 초기값
 * @returns [상태, 상태 업데이트 함수]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 초기 상태 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 상태가 변경될 때마다 로컬 스토리지 업데이트
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}