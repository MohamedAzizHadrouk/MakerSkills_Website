import React from 'react';
import { Grid, List, ShoppingCart, SlidersHorizontal } from 'lucide-react';

interface ShopTopBarProps {
  theme: 'light' | 'dark';
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOptions: { id: string; label: string }[];
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  cartCount: number;
  productCount: number;
}

const ShopTopBar: React.FC<ShopTopBarProps> = ({
  theme, sortBy, setSortBy, sortOptions, viewMode, setViewMode, cartCount, productCount
}) => (
  <div className={`flex flex-col md:flex-row items-center justify-between mb-8 p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{productCount} produit(s) trouvé(s)</span>
      <div className="flex items-center space-x-2">
        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-secondary-500 text-white' : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}><Grid className="h-4 w-4" /></button>
        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-secondary-500 text-white' : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}><List className="h-4 w-4" /></button>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <SlidersHorizontal className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`px-3 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}>
          {sortOptions.map(option => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="relative">
        <ShoppingCart className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
        )}
      </div>
    </div>
  </div>
);

export default ShopTopBar;
