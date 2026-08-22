import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, DollarSign, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { MaterialCardProps } from '../types/laboratory';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onEdit,
  onDelete,
  theme
}) => {
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      onDelete(material._id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return theme === 'dark' ? 'bg-green-600' : 'bg-green-500';
      case 'unavailable':
        return theme === 'dark' ? 'bg-red-600' : 'bg-red-500';
      case 'maintenance':
        return theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500';
      default:
        return theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'unavailable':
        return <XCircle className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'unavailable':
        return 'Indisponible';
      case 'maintenance':
        return 'En maintenance';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      {/* Image du matériel */}
      {(material.coverImagePath || material.imageUrl) && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={getImageUrl(material.coverImagePath || material.imageUrl)}
            alt={material.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {material.name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(material.status)} text-white`}>
              {getStatusIcon(material.status)}
              <span>{getStatusLabel(material.status)}</span>
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {material.type}
            </span>
          </div>
        </div>
        </div>

        {material.description && (
        <p className={`text-sm mb-4 line-clamp-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {material.description}
        </p>
      )}

        {/* Tarif */}
        <div className="flex items-center justify-between mb-4">
          {material.isFree ? (
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              Gratuit
            </span>
          ) : (
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-4 h-4 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {material.hourlyRate} TND/heure
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit(material)}
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
        </div>
      </div>
    </motion.div>
  );
};

export default MaterialCard;

