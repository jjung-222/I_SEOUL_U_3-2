import React from 'react';
import { Product, ProductWithUI, CartItem, Coupon } from '../../../types';
import ProductSection from './product/ProductContainer';
import Sidebar from './sidebar/SidebarContainer';

interface ShopContainerProps {
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

const ShopContainer: React.FC<ShopContainerProps> = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
  cart,
  calculateItemTotal,
  removeFromCart,
  updateQuantity,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  applyCoupon,
  totals,
  completeOrder,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 상품 목록 */}
      <ProductSection 
        products={products}
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        getRemainingStock={getRemainingStock}
        formatPrice={formatPrice}
        addToCart={addToCart}
      />
      
      {/* 사이드바 */}
      <Sidebar 
        cart={cart}
        calculateItemTotal={calculateItemTotal}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        applyCoupon={applyCoupon}
        totals={totals}
        completeOrder={completeOrder}
      />
    </div>
  );
};

export default ShopContainer;
