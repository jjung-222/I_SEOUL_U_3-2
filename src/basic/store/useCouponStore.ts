import { create } from 'zustand';
import { Coupon } from '../../types';
import initialCoupons from '../constants/coupons.json';
import { useNotificationStore } from './useNotificationStore';

interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  setCoupons: (coupons: Coupon[]) => void;
  resetStore: () => void;
}

const getInitialCoupons = (): Coupon[] => {
  const stored = localStorage.getItem('coupons');
  return stored ? JSON.parse(stored) : (initialCoupons as Coupon[]);
};

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: getInitialCoupons(),

  setCoupons: (coupons) => {
    set({ coupons });
    localStorage.setItem('coupons', JSON.stringify(coupons));
  },

  addCoupon: (newCoupon) => {
    if (get().coupons.find(c => c.code === newCoupon.code)) {
      useNotificationStore.getState().addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
      return;
    }
    const newCoupons = [...get().coupons, newCoupon];
    get().setCoupons(newCoupons);
    useNotificationStore.getState().addNotification('쿠폰이 추가되었습니다.', 'success');
  },

  deleteCoupon: (code) => {
    const newCoupons = get().coupons.filter(c => c.code !== code);
    get().setCoupons(newCoupons);
    useNotificationStore.getState().addNotification('쿠폰이 삭제되었습니다.', 'success');
  },

  resetStore: () => {
    set({ coupons: initialCoupons as Coupon[] });
    localStorage.removeItem('coupons');
  }
}));
