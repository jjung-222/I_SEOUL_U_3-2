import React from 'react';
import { ProductWithUI, Coupon } from '../../../types';
import AdminContainer from '../../components/admin/AdminContainer';

interface AdminPageProps {
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

const AdminPage: React.FC<AdminPageProps> = (props) => {
  return <AdminContainer {...props} />;
};

export default AdminPage;