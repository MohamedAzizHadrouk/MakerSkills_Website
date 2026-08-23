import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import { Category } from '../types/category';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  index
}) => {
  const { theme } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } group relative ${
        isSelected 
          ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' 
          : ''
      }`}
    >
      {/* Selection checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(category._id)}
          className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{category.icon || '📁'}</span>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color || '#3B82F6' }}
              />
            </div>
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {category.name}
            </h3>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(category)}
              className="p-2 bg-white rounded-full text-orange-500 hover:bg-orange-50 transition-colors shadow-lg"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(category._id)}
              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {category.description && (
          <p className={`text-sm mb-4 line-clamp-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {category.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-white text-xs font-medium bg-blue-500`}>
              Catégorie
            </span>
          </div>
          
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {category.itemCount || 0} éléments
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard; 