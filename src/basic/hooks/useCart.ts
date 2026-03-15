import { useState, useCallback } from 'react';
import { CartItem, Coupon, Product, ProductWithUI, Discount } from '../../types';
import { useNotificationStore } from '../store/useNotificationStore';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { addNotification } = useNotificationStore();

  const getRemainingStock = useCallback((product: Product): number => {
    const cartItem = cart.find(item => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);
    return remaining;
  }, [cart]);

  const addToCart = useCallback((product: ProductWithUI) => {
    const remainingStock = getRemainingStock(product);
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return prevCart;
        }

        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    addNotification('장바구니에 담았습니다', 'success');
  }, [addNotification, getRemainingStock]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number, products: ProductWithUI[]) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart, addNotification]);

  const getMaxApplicableDiscount = useCallback((item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;
    
    const baseDiscount = discounts.reduce((maxDiscount: number, discount: Discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount 
        ? discount.rate 
        : maxDiscount;
    }, 0);
    
    const hasBulkPurchase = cart.some(cartItem => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }
    
    return baseDiscount;
  }, [cart]);

  const calculateItemTotal = useCallback((item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);
    
    return Math.round(price * quantity * (1 - discount));
  }, [getMaxApplicableDiscount]);

  const calculateCartTotal = useCallback((): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

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
  }, [cart, calculateItemTotal, selectedCoupon]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateCartTotal().totalAfterDiscount;
    
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [addNotification, calculateCartTotal]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    setCart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
    totalItemCount
  };
}