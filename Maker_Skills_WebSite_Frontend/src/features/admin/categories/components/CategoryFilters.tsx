import React from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  const { theme } = useStore();

  return (
    <div className={`p-6 rounded-2xl ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg border border-gray-200 dark:border-gray-700`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>
    </div>
  );
};

export default CategoryFilters; 