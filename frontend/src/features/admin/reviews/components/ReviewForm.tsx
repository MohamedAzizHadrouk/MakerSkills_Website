import React, { useState } from 'react';
import { CreateReviewDto } from '../review';
import MediaUpload from '../../../../shared/components/MediaUpload';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

interface ReviewFormProps {
  initialValues?: Partial<CreateReviewDto>;
  onSubmit: (values: CreateReviewDto, imageFile?: File) => void;
  onCancel: () => void;
  loading?: boolean;
  theme: 'light' | 'dark';
}

const ReviewForm: React.FC<ReviewFormProps> = ({ initialValues = {}, onSubmit, onCancel, loading, theme }) => {
  const [form, setForm] = useState<CreateReviewDto>({
    fullName: initialValues.fullName || '',
    posteActuelle: initialValues.posteActuelle || '',
    image: initialValues.image || '',
    stars: initialValues.stars || 5,
    message: initialValues.message || '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStars = (stars: number) => {
    setForm({ ...form, stars });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, imageFiles[0]);
  };

  const existingImages = form.image ? [getImageUrl(form.image)] : [];

  return (
    <form onSubmit={handleSubmit} className={`p-8 rounded-2xl max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nom *</label>
          <input
            type="text"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Poste actuel</label>
          <input
            type="text"
            name="posteActuelle"
            value={form.posteActuelle}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Étoiles *</label>
        <div className="flex items-center space-x-1">
          {[1,2,3,4,5].map(i => (
            <button
              type="button"
              key={i}
              onClick={() => handleStars(i)}
              className={i <= form.stars ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Message *</label>
        <textarea
          name="message"
          required
          value={form.message}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>
      <div>
        <MediaUpload
          images={imageFiles}
          setImages={setImageFiles}
          existingImages={existingImages}
          label="Photo du client (optionnelle)"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 