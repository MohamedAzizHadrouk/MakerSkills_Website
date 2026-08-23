import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Partner } from '../partner';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

interface PartnerCardProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  theme: 'light' | 'dark';
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onEdit, onDelete, theme }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}> 
      <img
        src={getImageUrl(partner.logo) || '/placeholder-partner.png'}
        alt={partner.name}
        className="w-24 h-24 rounded-xl object-contain mb-4 bg-white dark:bg-gray-900"
      />
      <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{partner.name}</h3>
      <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{partner.specialite}</div>
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className={`mb-2 text-blue-500 hover:underline text-xs`}
        >
          {partner.website}
        </a>
      )}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onEdit(partner)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(partner._id)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
              : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
          }`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PartnerCard; 