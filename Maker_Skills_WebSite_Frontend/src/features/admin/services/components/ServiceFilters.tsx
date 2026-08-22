import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { ServiceFiltersProps } from '../types/service';

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  theme,
  filters,
  setFilters,
  categories
}) => {
  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.category || filters.active !== undefined || filters.search;

  return (
    <div className={`p-6 rounded-xl ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Filtres
          </h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>

        {/* Filtre par catégorie */}
        <div>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="">Toutes les catégories</option>
            {Array.isArray(categories) && categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par statut */}
        <div>
          <select
            value={filters.active === undefined ? '' : filters.active.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                active: value === '' ? undefined : value === 'true'
              });
            }}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="">Tous les statuts</option>
            <option value="true">Actifs uniquement</option>
            <option value="false">Inactifs uniquement</option>
          </select>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.search && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800'
            }`}>
              Recherche: {filters.search}
            </span>
          )}
          
          {filters.category && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800'
            }`}>
              Catégorie: {Array.isArray(categories) && categories.find(c => c._id === filters.category)?.name}
            </span>
          )}
          
          {filters.active !== undefined && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}>
              Statut: {filters.active ? 'Actifs' : 'Inactifs'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceFilters; 