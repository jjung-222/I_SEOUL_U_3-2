import { useCallback } from 'react';
import { Coupon } from '../../types';
import initialCoupons from '../constants/coupons.json';
import { useNotificationStore } from '../store/useNotificationStore';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCoupons() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons as Coupon[]);
  const { addNotification } = useNotificationStore();

  const addCoupon = useCallback((newCoupon: Coupon) => {
    const existingCoupon = coupons.find(c => c.code === newCoupon.code);
    if (existingCoupon) {
      addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    setCoupons(prev => [...prev, newCoupon]);
    addNotification('쿠폰이 추가되었습니다.', 'success');
  }, [coupons, addNotification]);

  const deleteCoupon = useCallback((couponCode: string, onDeleted?: () => void) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));
    if (onDeleted) onDeleted();
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [addNotification]);

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
}