import React from 'react';
import ProductSection from './product/ProductContainer';
import Sidebar from './sidebar/SidebarContainer';

interface ShopContainerProps {
  filteredProducts: any[];
  debouncedSearchTerm: string;
  formatPrice: (price: number, id?: string) => string;
}

const ShopContainer: React.FC<ShopContainerProps> = ({
  filteredProducts,
  debouncedSearchTerm,
  formatPrice,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 상품 목록 */}
      <ProductSection 
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        formatPrice={formatPrice}
      />
      
      {/* 사이드바 */}
      <Sidebar />
    </div>
  );
};

export default ShopContainer;
