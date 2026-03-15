import { Product, ProductWithUI } from '../../../../types';
import EmptySet from './EmptySet';
import ProductList from './ProductList';

interface ProductSectionProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, id?: string) => string;
  addToCart: (product: Product) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  formatPrice,
  addToCart,
}) => {
  return (
    <div className="lg:col-span-3">
        <section>
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
            <div className="text-sm text-gray-600">
            총 {products.length}개 상품
            </div>
        </div>
        {filteredProducts.length === 0 ? (
            <EmptySet searchTerm={debouncedSearchTerm} />
        ) : (
            <ProductList 
                filteredProducts={filteredProducts}
                getRemainingStock={getRemainingStock}
                formatPrice={formatPrice}
                addToCart={addToCart}
            />
        )}
        </section>
    </div>
  );
};

export default ProductSection;
