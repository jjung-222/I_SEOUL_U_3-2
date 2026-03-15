import { create } from 'zustand';
import { ProductWithUI } from '../../types';
import initialProducts from '../constants/products.json';
import { useNotificationStore } from './useNotificationStore';

interface ProductState {
  products: ProductWithUI[];
  addProduct: (product: Omit<ProductWithUI, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (id: string) => void;
  setProducts: (products: ProductWithUI[]) => void;
  resetStore: () => void;
}

// 로컬 스토리지에서 초기 데이터 로드
const getInitialProducts = (): ProductWithUI[] => {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : (initialProducts as ProductWithUI[]);
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: getInitialProducts(),

  setProducts: (products) => {
    set({ products });
    localStorage.setItem('products', JSON.stringify(products));
  },

  addProduct: (newProduct) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`
    };
    const newProducts = [...get().products, product];
    get().setProducts(newProducts);
    useNotificationStore.getState().addNotification('상품이 추가되었습니다.', 'success');
  },

  updateProduct: (id, updates) => {
    const newProducts = get().products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    get().setProducts(newProducts);
    useNotificationStore.getState().addNotification('상품이 수정되었습니다.', 'success');
  },

  deleteProduct: (id) => {
    const newProducts = get().products.filter(p => p.id !== id);
    get().setProducts(newProducts);
    useNotificationStore.getState().addNotification('상품이 삭제되었습니다.', 'success');
  },

  resetStore: () => {
    set({ products: initialProducts as ProductWithUI[] });
    localStorage.removeItem('products');
  }
}));
