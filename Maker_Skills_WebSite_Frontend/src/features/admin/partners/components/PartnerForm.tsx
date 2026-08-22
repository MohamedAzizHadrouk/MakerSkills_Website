import React, { useState } from 'react';
import { Partner, CreatePartnerDto } from '../partner';
import MediaUpload from '../../../../shared/components/MediaUpload';
import { getImageUrl } from '../../../../shared/utils/imageUtils';


interface PartnerFormProps {
  initialValues?: Partial<CreatePartnerDto>;
  onSubmit: (values: CreatePartnerDto, logoFile?: File) => void;
  onCancel: () => void;
  loading?: boolean;
  theme: 'light' | 'dark';
}

const PartnerForm: React.FC<PartnerFormProps> = ({ initialValues = {}, onSubmit, onCancel, loading, theme }) => {
  const [form, setForm] = useState<CreatePartnerDto>({
    name: initialValues.name || '',
    specialite: initialValues.specialite || '',
    website: initialValues.website || '',
    logo: initialValues.logo || '',
  });
  const [logoFiles, setLogoFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, logoFiles[0]);
  };

  // Affichage du logo existant avec getImageUrl
  const existingImages = form.logo ? [getImageUrl(form.logo)] : [];

  return (
    <form onSubmit={handleSubmit} className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nom *</label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Spécialité *</label>
        <input
          type="text"
          name="specialite"
          required
          value={form.specialite}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Site web</label>
        <input
          type="url"
          name="website"
          value={form.website}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>
      <div>
        <MediaUpload
          images={logoFiles}
          setImages={setLogoFiles}
          existingImages={existingImages}
          label="Logo du partenaire"
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

export default PartnerForm; 