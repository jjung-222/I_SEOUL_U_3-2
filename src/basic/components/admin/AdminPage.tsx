import React from 'react';
import AdminContainer from './AdminContainer';

interface AdminPageProps {
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;
  formatPrice: (price: number, id?: string) => string;
  startEditProduct: (product: any) => void;
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