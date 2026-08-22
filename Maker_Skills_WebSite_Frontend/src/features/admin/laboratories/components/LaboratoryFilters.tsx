import React from 'react';
import { Search, Filter, X, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { LaboratoryFiltersProps } from '../types/laboratory';

const LaboratoryFilters: React.FC<LaboratoryFiltersProps> = ({
  theme,
  filters,
  setFilters,
  selectedLaboratories = [],
  laboratoriesCount = 0,
  onSelectAll,
  onClearSelection,
}) => {
  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = filters.search || filters.minRate || filters.maxRate;

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
            placeholder="Rechercher un laboratoire..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>

        {/* Filtre par tarif minimum */}
        <div>
          <input
            type="number"
            placeholder="Tarif min (TND)"
            value={filters.minRate || ''}
            onChange={(e) => setFilters({ 
              ...filters, 
              minRate: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>

        {/* Filtre par tarif maximum */}
        <div>
          <input
            type="number"
            placeholder="Tarif max (TND)"
            value={filters.maxRate || ''}
            onChange={(e) => setFilters({ 
              ...filters, 
              maxRate: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
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
          
          {filters.minRate && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800'
            }`}>
              Tarif min: {filters.minRate}€
            </span>
          )}
          
          {filters.maxRate && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800'
            }`}>
              Tarif max: {filters.maxRate}€
            </span>
          )}
        </div>
      )}

      {/* Sélection multiple */}
      {laboratoriesCount > 0 && onSelectAll && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onSelectAll}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedLaboratories.length === laboratoriesCount
                    ? theme === 'dark'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-orange-50 text-orange-600 border border-orange-200'
                    : theme === 'dark'
                      ? 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {selectedLaboratories.length === laboratoriesCount ? (
                  <CheckSquare className="w-5 h-5 text-orange-500" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span className="text-sm font-semibold">
                  {selectedLaboratories.length === laboratoriesCount ? 'Désélectionner tout' : 'Sélectionner tout'}
                </span>
              </motion.button>
              
              {selectedLaboratories.length > 0 && (
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    theme === 'dark'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {selectedLaboratories.length} sélectionné{selectedLaboratories.length > 1 ? 's' : ''}
                  </div>
                  {onClearSelection && (
                    <button
                      onClick={onClearSelection}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Effacer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryFilters;

