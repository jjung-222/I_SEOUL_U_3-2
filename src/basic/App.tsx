import { useState, useCallback } from 'react';
import { ProductWithUI } from '../types';
import Header from './components/layout/Header';
import AdminPage from './components/admin/AdminPage';
import ShopPage from './components/shop/ShopPage';
import { useNotificationStore } from './store/useNotificationStore';
import NotificationList from './components/ui/NotificationList';
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { formatPrice as formatPriceUtil } from './utils/formatters';
import { useDebounce } from './utils/hooks/useDebounce';

const App = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const {
    coupons,
    addCoupon,
    deleteCoupon
  } = useCoupons();

  const {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
    calculateCartTotal,
    calculateItemTotal,
    getRemainingStock,
    totalItemCount
  } = useCart();

  const [isAdmin, setIsAdmin] = useState(false);
  const { addNotification } = useNotificationStore();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Admin
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






  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity, products);
  }, [updateQuantity, products]);


  const handleDeleteCoupon = useCallback((couponCode: string) => {
    deleteCoupon(couponCode, () => {
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    });
  }, [deleteCoupon, selectedCoupon, setSelectedCoupon]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts
      });
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

  const startEditProduct = (product: ProductWithUI) => {
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

  const totals = calculateCartTotal();

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
        cartCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage 
            products={products}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
            coupons={coupons}
            deleteCoupon={handleDeleteCoupon}
            showCouponForm={showCouponForm}
            setShowCouponForm={setShowCouponForm}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            handleCouponSubmit={handleCouponSubmit}
          />
        ) : (
          <ShopPage 
            products={products}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            getRemainingStock={getRemainingStock}
            formatPrice={formatPrice}
            addToCart={addToCart}
            cart={cart}
            calculateItemTotal={calculateItemTotal}
            removeFromCart={removeFromCart}
            updateQuantity={handleUpdateQuantity}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            applyCoupon={applyCoupon}
            totals={totals}
            completeOrder={completeOrder}
          />
        )}
      </main>
    </div>
  );
};

export default App;