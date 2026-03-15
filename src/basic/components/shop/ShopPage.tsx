import React from 'react';
import { Product, ProductWithUI, CartItem, Coupon } from '../../../types';
import ShopContainer from './ShopContainer';

interface ShopPageProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, id?: string) => string;
  addToCart: (product: Product) => void;
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  applyCoupon: (coupon: Coupon) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
}

const ShopPage: React.FC<ShopPageProps> = (props) => {
  return <ShopContainer {...props} />;
};

export default ShopPage;