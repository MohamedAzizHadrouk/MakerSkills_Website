import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  categories: { id: string; label: string }[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  categories
}) => {
  const { theme } = useStore();

  return (
    <div className={`p-6 rounded-2xl ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg border border-gray-200 dark:border-gray-700`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 