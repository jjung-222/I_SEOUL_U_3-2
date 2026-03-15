import { CartItem, Coupon as CouponType } from '../../../../types';
import Cart from './Cart';
import Coupon from './Coupon';
import Payment from './Payment';

interface SidebarProps {
  cart: CartItem[];
  calculateItemTotal: (item: CartItem) => number;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  coupons: CouponType[];
  selectedCoupon: CouponType | null;
  setSelectedCoupon: (coupon: CouponType | null) => void;
  applyCoupon: (coupon: CouponType) => void;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  completeOrder: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
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
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <Cart 
          cart={cart}
          calculateItemTotal={calculateItemTotal}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />

        {cart.length > 0 && (
          <>
            <Coupon 
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              applyCoupon={applyCoupon}
              setSelectedCoupon={setSelectedCoupon}
            />

            <Payment 
              totals={totals}
              completeOrder={completeOrder}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
