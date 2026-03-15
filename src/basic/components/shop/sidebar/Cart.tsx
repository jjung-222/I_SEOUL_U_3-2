import React from 'react';
import { useCartStore } from '../../../store/useCartStore';
import { useProductStore } from '../../../store/useProductStore';

const Cart: React.FC = () => {
  const { cart, calculateItemTotal, removeFromCart, updateQuantity } = useCartStore();
  const { products } = useProductStore();

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        장바구니
      </h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-400 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => {
            const itemTotal = calculateItemTotal(item);
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

            return (
              <div key={item.product.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-900 flex-1 pr-2">{item.product.name}</h4>
                  <button 
                    onClick={() => removeFromCart(item.product.id)} 
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, products)} 
                      className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <span className="text-sm">−</span>
                    </button>
                    <span className="mx-2 text-sm font-medium w-8 text-center text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, products)} 
                      className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <span className="text-sm">+</span>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    {hasDiscount && (
                      <span className="text-[10px] text-red-500 font-bold block mb-0.5">-{discountRate}%</span>
                    )}
                    <p className="text-sm font-bold text-gray-900">
                      {Math.round(itemTotal).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Cart;
