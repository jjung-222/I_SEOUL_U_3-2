import React from 'react';
import ProductList from './ProductList';
import EmptySet from './EmptySet';
import { useProductStore } from '../../../store/useProductStore';

interface ProductSectionProps {
  filteredProducts: any[];
  debouncedSearchTerm: string;
  formatPrice: (price: number, id?: string) => string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  filteredProducts,
  debouncedSearchTerm,
  formatPrice,
}) => {
  const { products } = useProductStore();

  return (
    <div className="lg:col-span-3">
      {/* 상품 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">전체 상품</h2>
        <div className="text-sm text-gray-500 font-medium">
          총 {products.length}개 상품
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductList 
          filteredProducts={filteredProducts}
          formatPrice={formatPrice}
        />
      ) : (
        <EmptySet debouncedSearchTerm={debouncedSearchTerm} />
      )}
    </div>
  );
};

export default ProductSection;
