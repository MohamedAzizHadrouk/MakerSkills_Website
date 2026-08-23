import React from 'react';
import { motion } from 'framer-motion';
import { LaboratoryFormProps } from '../types/laboratory';
import RichTextEditor from '../../../../shared/components/RichTextEditor';
import MediaUpload from '../../../../shared/components/MediaUpload';

const LaboratoryForm: React.FC<LaboratoryFormProps> = ({
  theme,
  editingLaboratory,
  loading,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  imageFiles,
  setImageFiles
}) => {
  const handleRemoveExistingImage = (index: number) => {
    console.log('Suppression image existante:', index);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {editingLaboratory ? 'Modifier le Laboratoire' : 'Nouveau Laboratoire'}
          </h1>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          ✕
        </button>
      </div>

      <form onSubmit={onSubmit} className={`p-8 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Titre du laboratoire *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tarif par heure (TND) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Décrivez votre laboratoire..."
            className="w-full"
          />
        </div>

        {/* Media Upload Component */}
        <MediaUpload
          images={imageFiles}
          setImages={setImageFiles}
          existingImages={editingLaboratory?.coverImagePath ? [editingLaboratory.coverImagePath] : []}
          onRemoveExistingImage={handleRemoveExistingImage}
          label="Image du laboratoire"
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Annuler
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Enregistrement...' : (editingLaboratory ? 'Modifier' : 'Créer')}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default LaboratoryForm;

