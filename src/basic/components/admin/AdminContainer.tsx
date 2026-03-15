import React from 'react';
import { ProductWithUI, Coupon } from '../../../types';
import ProductMangerTab from './ProductMangerTab';
import CouponMagerTab from './CouponMagerTab';
import AdminTabs from './AdminTabs';

interface AdminContainerProps {
  products: ProductWithUI[];
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;
  formatPrice: (price: number, id?: string) => string;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (id: string) => void;
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  setProductForm: (form: any) => void;
  editingProduct: string | null;
  setEditingProduct: (id: string | null) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  setCouponForm: (form: any) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
}

const AdminContainer: React.FC<AdminContainerProps> = ({
  products,
  activeTab,
  setActiveTab,
  formatPrice,
  startEditProduct,
  deleteProduct,
  showProductForm,
  setShowProductForm,
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  handleProductSubmit,
  addNotification,
  coupons,
  deleteCoupon,
  showCouponForm,
  setShowCouponForm,
  couponForm,
  setCouponForm,
  handleCouponSubmit,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'products' ? (
        <ProductMangerTab 
          products={products}
          formatPrice={formatPrice}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          handleProductSubmit={handleProductSubmit}
          addNotification={addNotification}
        />
      ) : (
        <CouponMagerTab 
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminContainer;
