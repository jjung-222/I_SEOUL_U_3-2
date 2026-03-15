import { useCallback } from 'react';
import { isValidPrice, isValidStock, isValidCouponCode } from '../validators';

/**
 * 프로젝트 전반의 검증 로직과 에러 메시지를 관리하는 커스텀 훅입니다.
 */
export function useValidate() {
  /**
   * 가격 검증
   */
  const validatePrice = useCallback((value: number) => {
    if (!isValidPrice(value)) {
      return { isValid: false, message: '가격은 0보다 커야 합니다', fallbackValue: 0 };
    }
    return { isValid: true, message: '', fallbackValue: value };
  }, []);

  /**
   * 재고 검증
   */
  const validateStock = useCallback((value: number) => {
    if (!isValidStock(value)) {
      if (value < 0) {
        return { isValid: false, message: '재고는 0보다 커야 합니다', fallbackValue: 0 };
      }
      return { isValid: false, message: '재고는 9999개를 초과할 수 없습니다', fallbackValue: 9999 };
    }
    return { isValid: true, message: '', fallbackValue: value };
  }, []);

  /**
   * 쿠폰 코드 검증
   */
  const validateCouponCode = useCallback((code: string) => {
    if (!isValidCouponCode(code)) {
      return { isValid: false, message: '쿠폰 코드는 4-12자의 영문 대문자와 숫자여야 합니다' };
    }
    return { isValid: true, message: '' };
  }, []);

  /**
   * 할인 값 검증 (금액 또는 퍼센트)
   */
  const validateDiscountValue = useCallback((value: number, type: 'amount' | 'percentage') => {
    if (type === 'percentage') {
      if (value > 100) {
        return { isValid: false, message: '할인율은 100%를 초과할 수 없습니다', fallbackValue: 100 };
      }
      if (value < 0) {
        return { isValid: false, message: '할인율은 0% 이상이어야 합니다', fallbackValue: 0 };
      }
    } else {
      if (value > 100000) {
        return { isValid: false, message: '할인 금액은 100,000원을 초과할 수 없습니다', fallbackValue: 100000 };
      }
      if (value < 0) {
        return { isValid: false, message: '할인 금액은 0원 이상이어야 합니다', fallbackValue: 0 };
      }
    }
    return { isValid: true, message: '', fallbackValue: value };
  }, []);

  return {
    validatePrice,
    validateStock,
    validateCouponCode,
    validateDiscountValue
  };
}
