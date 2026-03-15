import { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import AdminPage from './components/admin/AdminPage';
import ShopPage from './components/shop/ShopPage';
import NotificationList from './components/ui/NotificationList';
import { useProductStore } from './store/useProductStore';
import { useCouponStore } from './store/useCouponStore';
import { useCartStore } from './store/useCartStore';
import { formatPrice as formatPriceUtil } from './utils/formatters';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { addCoupon, deleteCoupon } = useCouponStore();
  const { calculateCartTotal, getRemainingStock } = useCartStore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin UI States
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [] as Array<{ quantity: number; rate: number }>
  });

  const [couponForm, setCouponForm] = useState({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0
  });

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return 'SOLD OUT';
      }
    }

    if (isAdmin) {
      return formatPriceUtil(price);
    }
    
    return `₩${price.toLocaleString()}`;
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
    } else {
      addProduct(productForm);
    }
    setProductForm({ name: '', price: 0, stock: 0, description: '', discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || []
    });
    setShowProductForm(true);
  };

  const filteredProducts = debouncedSearchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      <Header 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={0} // Header 내부에서 useCartStore로 관리하므로 0 전달 (무시됨)
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formatPrice={formatPrice}
            startEditProduct={startEditProduct}
            showProductForm={showProductForm}
            setShowProductForm={setShowProductForm}
            productForm={productForm}
            setProductForm={setProductForm}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            handleProductSubmit={handleProductSubmit}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            handleCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <ShopPage 
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            formatPrice={formatPrice}
          />
        )}
      </main>
    </div>
  );
};

export default App;