import React from 'react';
import { motion } from 'framer-motion';

interface BootcampBulkActionsProps {
  theme: 'light' | 'dark';
  selectedBootcamps: string[];
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

const BootcampBulkActions: React.FC<BootcampBulkActionsProps> = ({
  theme,
  selectedBootcamps,
  onClearSelection,
  onBulkDelete
}) => {
  if (selectedBootcamps.length === 0) return null;

  return (
    <div className={`p-4 rounded-2xl mb-8 ${
      theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
    } border border-orange-200 dark:border-orange-800`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-orange-300' : 'text-orange-700'
          }`}>
            {selectedBootcamps.length} bootcamp(s) sélectionné(s)
          </span>
          <button
            onClick={onClearSelection}
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Supprimer ({selectedBootcamps.length})
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BootcampBulkActions; 