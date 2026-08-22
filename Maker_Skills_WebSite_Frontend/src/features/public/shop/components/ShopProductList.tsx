import React from 'react';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import ShopProductCard from './ShopProductCard';
import { Product } from '../../../admin/products/types/product';

interface ShopProductListProps {
  products: (Product & { image: string })[];
  theme: 'light' | 'dark';
  viewMode: 'grid' | 'list';
}

const ShopProductList: React.FC<ShopProductListProps> = ({ products, theme, viewMode }) => {
  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
      {products.map((product, index) => (
        <AnimatedSection key={product._id} delay={index * 0.1}>
          <div className={viewMode === 'list' ? 'h-60' : ''}>
            <ShopProductCard
              product={product}
              theme={theme}
              viewMode={viewMode}
            />
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default ShopProductList;
