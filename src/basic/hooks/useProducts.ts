import { useCallback } from 'react';
import { ProductWithUI } from '../../types';
import initialProducts from '../constants/products.json';
import { useNotificationStore } from '../store/useNotificationStore';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useProducts() {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>('products', initialProducts as ProductWithUI[]);
  const { addNotification } = useNotificationStore();

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, 'id'>) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    setProducts(prev => [...prev, product]);
    addNotification('상품이 추가되었습니다.', 'success');
  }, [addNotification]);

  const updateProduct = useCallback((productId: string, updates: Partial<ProductWithUI>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
    addNotification('상품이 수정되었습니다.', 'success');
  }, [addNotification]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addNotification('상품이 삭제되었습니다.', 'success');
  }, [addNotification]);

  return {
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
}