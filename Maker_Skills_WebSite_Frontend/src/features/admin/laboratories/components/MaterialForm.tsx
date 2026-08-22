import React from 'react';
import { motion } from 'framer-motion';
import { MaterialFormProps } from '../types/laboratory';
import MediaUpload from '../../../../shared/components/MediaUpload';

const MaterialForm: React.FC<MaterialFormProps> = ({
  theme,
  editingMaterial,
  loading,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  imageFiles,
  setImageFiles,
  laboratoryId: _laboratoryId // Used in parent component for API calls
}) => {
  // laboratoryId is passed from parent but not used directly in this component
  void _laboratoryId;

  const handleRemoveExistingImage = (index: number) => {
    console.log('Suppression image existante:', index);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {editingMaterial ? 'Modifier le Matériel' : 'Nouveau Matériel'}
          </h2>
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

      <form onSubmit={onSubmit} className={`p-6 rounded-2xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nom du matériel *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              Type de matériel *
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
              placeholder="Ex: Imprimante 3D, Scanner, etc."
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Décrivez le matériel..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Statut *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ 
                ...formData, 
                status: e.target.value as 'available' | 'unavailable' | 'maintenance'
              })}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            >
              <option value="available">Disponible</option>
              <option value="unavailable">Indisponible</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Tarif par heure (TND) {!formData.isFree && '*'}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
              disabled={formData.isFree}
              required={!formData.isFree}
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isFree"
            checked={formData.isFree}
            onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="isFree" className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Matériel gratuit
          </label>
        </div>

        {/* Media Upload Component */}
        <MediaUpload
          images={imageFiles}
          setImages={setImageFiles}
          existingImages={editingMaterial?.coverImagePath ? [editingMaterial.coverImagePath] : []}
          onRemoveExistingImage={handleRemoveExistingImage}
          label="Image du matériel"
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
            {loading ? 'Enregistrement...' : (editingMaterial ? 'Modifier' : 'Créer')}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;

