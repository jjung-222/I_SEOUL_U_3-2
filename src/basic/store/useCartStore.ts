import { create } from 'zustand';
import { CartItem, Coupon, Product, ProductWithUI, Discount } from '../../types';
import { useNotificationStore } from './useNotificationStore';

interface CartState {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number, products: ProductWithUI[]) => void;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
  resetCart: () => void;
  
  // 계산 로직들
  getRemainingStock: (product: Product) => number;
  calculateItemTotal: (item: CartItem) => number;
  calculateCartTotal: () => { totalBeforeDiscount: number; totalAfterDiscount: number };
  getTotalItemCount: () => number;
  resetStore: () => void;
}

const getInitialCart = (): CartItem[] => {
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: getInitialCart(),
  selectedCoupon: null,

  resetCart: () => {
    set({ cart: [], selectedCoupon: null });
    localStorage.removeItem('cart');
  },

  getRemainingStock: (product) => {
    const cartItem = get().cart.find(item => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  },

  addToCart: (product) => {
    const remainingStock = get().getRemainingStock(product);
    if (remainingStock <= 0) {
      useNotificationStore.getState().addNotification('재고가 부족합니다!', 'error');
      return;
    }

    const existingItem = get().cart.find(item => item.product.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = get().cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...get().cart, { product, quantity: 1 }];
    }

    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    useNotificationStore.getState().addNotification('장바구니에 담았습니다', 'success');
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter(item => item.product.id !== productId);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  updateQuantity: (productId, newQuantity, products) => {
    if (newQuantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      useNotificationStore.getState().addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
      return;
    }

    const newCart = get().cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
  },

  calculateItemTotal: (item) => {
    const { price, discounts } = item.product;
    const { quantity } = item;
    
    // getMaxApplicableDiscount 로직 (origin/App.tsx:147-163 참조)
    const baseDiscount = discounts.reduce((maxDiscount: number, discount: Discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount 
        ? discount.rate 
        : maxDiscount;
    }, 0);
    
    // 대량 구매 시 추가 5% 할인 (장바구니 중 어느 한 품목이라도 10개 이상일 때 모든 품목 적용 여부 확인 필요)
    // 원본 코드(origin/App.tsx:157)를 보면 장바구니에 10개 이상인 품목이 하나라도 있으면 모든 품목에 5% 추가 할인이 적용됩니다.
    const hasBulkPurchase = get().cart.some(cartItem => cartItem.quantity >= 10);
    const finalDiscount = hasBulkPurchase ? Math.min(baseDiscount + 0.05, 0.5) : baseDiscount;
    
    return Math.round(price * quantity * (1 - finalDiscount));
  },

  calculateCartTotal: () => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    get().cart.forEach(item => {
      totalBeforeDiscount += item.product.price * item.quantity;
      totalAfterDiscount += get().calculateItemTotal(item);
    });

    const { selectedCoupon } = get();
    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount = Math.round(totalAfterDiscount * (1 - selectedCoupon.discountValue / 100));
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount)
    };
  },

  applyCoupon: (coupon) => {
    const currentTotal = get().calculateCartTotal().totalAfterDiscount;
    
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      useNotificationStore.getState().addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    set({ selectedCoupon: coupon });
    useNotificationStore.getState().addNotification('쿠폰이 적용되었습니다.', 'success');
  },

  setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),

  completeOrder: () => {
    const orderNumber = `ORD-${Date.now()}`;
    useNotificationStore.getState().addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    get().resetCart();
  },

  getTotalItemCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  resetStore: () => {
    set({ cart: [], selectedCoupon: null });
    localStorage.removeItem('cart');
  }
}));
