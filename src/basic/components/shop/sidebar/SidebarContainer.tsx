import React from 'react';
import Cart from './Cart';
import Coupon from './Coupon';
import Payment from './Payment';
import { useCartStore } from '../../../store/useCartStore';

const Sidebar: React.FC = () => {
  const cart = useCartStore(state => state.cart);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <Cart />

        {cart.length > 0 && (
          <>
            <Coupon />
            <Payment />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
