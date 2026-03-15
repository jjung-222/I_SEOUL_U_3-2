import React from 'react';
import ShopContainer from './ShopContainer';

interface ShopPageProps {
  products: any[];
  filteredProducts: any[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: any) => number;
  formatPrice: (price: number, id?: string) => string;
  addToCart: (product: any) => void;
  cart: any[];
  calculateItemTotal: (item: any) => number;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  coupons: any[];
  selectedCoupon: any | null;
  setSelectedCoupon: (coupon: any | null) => void;
  applyCoupon: (coupon: any) => void;
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