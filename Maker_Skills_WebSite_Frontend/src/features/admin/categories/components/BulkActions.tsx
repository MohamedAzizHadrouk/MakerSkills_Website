import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../../stores/useStore';

interface BulkActionsProps {
  selectedCount: number;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDeselectAll,
  onBulkDelete
}) => {
  const { theme } = useStore();

  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl ${
        theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
      } border border-orange-200 dark:border-orange-800`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
          }`}>
            {selectedCount} catégorie(s) sélectionnée(s)
          </span>
          <button
            onClick={onDeselectAll}
            className={`text-sm ${
              theme === 'dark' ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
            }`}
          >
            Désélectionner tout
          </button>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Supprimer ({selectedCount})
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BulkActions; 