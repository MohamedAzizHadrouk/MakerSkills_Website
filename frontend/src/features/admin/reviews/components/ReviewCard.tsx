import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';
import { Review } from '../review';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
  theme: 'light' | 'dark';
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete, theme }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg flex flex-col items-center h-full min-h-[420px] md:min-h-[440px] md:h-[440px] ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <img
        src={getImageUrl(review.image) || '/placeholder-user.png'}
        alt={review.fullName}
        className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-orange-400 shadow"
      />
      <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{review.fullName}</h3>
      {review.posteActuelle && (
        <div className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{review.posteActuelle}</div>
      )}
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < review.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < review.stars ? '#facc15' : 'none'} />
        ))}
      </div>
      <p className={`text-sm italic text-center mb-4 flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{review.message}</p>
      <div className="flex space-x-2 mt-auto">
        <button
          onClick={() => onEdit(review)}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(review._id)}
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

export default ReviewCard; 