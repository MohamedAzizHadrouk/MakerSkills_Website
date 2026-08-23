import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { LaboratoryCardProps } from '../types/laboratory';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

const LaboratoryCard: React.FC<LaboratoryCardProps> = ({
  laboratory,
  onEdit,
  onDelete,
  theme,
  onShowDetail
}) => {
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce laboratoire ?')) {
      onDelete(laboratory._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} min-h-[420px] h-full flex flex-col`}
      onClick={() => onShowDetail && onShowDetail(laboratory)}
    >
      {/* Image du laboratoire */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(laboratory.coverImagePath || laboratory.imageUrl)}
          alt={laboratory.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Contenu de la carte */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className={`text-xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {laboratory.title}
        </h3>

        {laboratory.description && (
          <p className={`text-sm mb-4 line-clamp-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {laboratory.description}
          </p>
        )}

        {/* Tarif */}
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className={`w-4 h-4 ${
            theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
          }`} />
          <span className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {laboratory.hourlyRate} TND/heure
          </span>
        </div>

        {/* Nombre de matériels */}
        {laboratory.materials && (
          <div className={`text-xs mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {laboratory.materials.length} matériel(s) disponible(s)
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="text-xs text-gray-500">
            Créé le {new Date(laboratory.createdAt).toLocaleDateString('fr-FR')}
          </div>
          
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(laboratory)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-blue-400 hover:bg-blue-400/10'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-400/10'
                  : 'text-red-600 hover:bg-red-50'
              }`}
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Bouton voir le détail */}
            {onShowDetail && (
              <button
                onClick={() => onShowDetail(laboratory)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-orange-400 hover:bg-orange-400/10'
                    : 'text-orange-600 hover:bg-orange-50'
                }`}
                title="Voir le détail"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LaboratoryCard;

