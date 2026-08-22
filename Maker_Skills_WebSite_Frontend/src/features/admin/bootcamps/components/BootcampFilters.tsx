import React from 'react';
import { useSelections } from '../hooks/useSelections';

interface BootcampFiltersProps {
  theme: 'light' | 'dark';
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

const BootcampFilters: React.FC<BootcampFiltersProps> = ({
  theme,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory
}) => {
  const { getCategoriesForComponents } = useSelections();

  return (
    <div className={`p-6 rounded-xl mb-8 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher un bootcamp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-4 pr-4 py-3 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="all">Toutes les catégories</option>
            {getCategoriesForComponents().map(category => (
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

export default BootcampFilters; 