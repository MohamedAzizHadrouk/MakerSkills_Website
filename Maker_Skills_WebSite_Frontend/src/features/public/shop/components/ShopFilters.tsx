import React from 'react';
import { Search } from 'lucide-react';

interface ShopFiltersProps {
  theme: 'light' | 'dark';
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  categories: { id: string; label: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  priceRanges: { id: string; label: string }[];
  selectedPriceRange: string;
  setSelectedPriceRange: (v: string) => void;
  selectedAvailability: string;
  setSelectedAvailability: (v: string) => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  theme, searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory,
  priceRanges, selectedPriceRange, setSelectedPriceRange,
}) => (
  <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} sticky top-24`}>
    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Filtres</h3>
    {/* Search */}
    <div className="mb-6">
      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Rechercher</label>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher un produit..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
        />
      </div>
    </div>
    {/* Categories */}
    <div className="mb-6">
      <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Catégories</label>
      <div className="space-y-2">
        {categories.map(category => (
          <label key={category.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-4 h-4 text-secondary-500 border-gray-300 focus:ring-secondary-500"
              />
              <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{category.label}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>{category.count}</span>
          </label>
        ))}
      </div>
    </div>
    {/* Price Range */}
    <div className="mb-6">
      <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Prix</label>
      <div className="space-y-2">
        {priceRanges.map(range => (
          <label key={range.id} className="flex items-center">
            <input
              type="radio"
              name="price"
              value={range.id}
              checked={selectedPriceRange === range.id}
              onChange={e => setSelectedPriceRange(e.target.value)}
              className="w-4 h-4 text-secondary-500 border-gray-300 focus:ring-secondary-500"
            />
            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{range.label}</span>
          </label>
        ))}
      </div>
    </div>
   
  </div>
);

export default ShopFilters;
