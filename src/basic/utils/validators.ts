/**
 * 쿠폰 코드 형식을 검증합니다. (4-12자 영문 대문자와 숫자)
 */
export const isValidCouponCode = (code: string): boolean => {
  const couponRegex = /^[A-Z0-9]{4,12}$/;
  return couponRegex.test(code);
};

/**
 * 재고 수량을 검증합니다. (0 이상 9999 이하)
 */
export const isValidStock = (stock: number): boolean => {
  return stock >= 0 && stock <= 9999;
};

/**
 * 가격을 검증합니다. (0 이상)
 */
export const isValidPrice = (price: number): boolean => {
  return price >= 0;
};

/**
 * 문자열이 오직 숫자로만 구성되어 있는지 확인합니다.
 */
export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

/**
 * 문자열에서 숫자만 추출하여 반환합니다.
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};