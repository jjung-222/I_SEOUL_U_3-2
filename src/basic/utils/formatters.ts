/**
 * 가격을 한국 원화 형식으로 포맷합니다.
 * @param price 가격
 * @returns 포맷팅된 가격 문자열 (예: 1,000원)
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷합니다.
 * @param date 날짜 객체
 * @returns 포맷팅된 날짜 문자열 (예: 2024-03-15)
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 소수를 퍼센트 형식으로 변환합니다.
 * @param rate 할인율 등 소수점 값 (예: 0.1)
 * @returns 퍼센트 문자열 (예: 10%)
 */
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};