import React, { useState } from 'react';
import { CreateBlogDto } from '../blog';
import { getImageUrl } from '../../../../shared/utils/imageUtils';
import MediaUpload from '../../../../shared/components/MediaUpload';
import RichTextEditor from '../../../../shared/components/RichTextEditor';


interface BlogFormProps {
  initialValues?: Partial<CreateBlogDto>;
  onSubmit: (values: CreateBlogDto, coverFile: File, imageFiles?: File[], videoFile?: File) => void;
  onCancel: () => void;
  loading?: boolean;
  theme: 'light' | 'dark';
}

const BlogForm: React.FC<BlogFormProps> = ({ initialValues = {}, onSubmit, onCancel, loading, theme }) => {
  const [form, setForm] = useState<CreateBlogDto>({
    title: initialValues.title || '',
    cover: initialValues.cover || '',
    images: initialValues.images || [],
    description: initialValues.description || '',
  });
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value: string) => {
    setForm({ ...form, description: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, coverFiles[0], imageFiles, videoFiles[0]);
  };

  const existingCover = form.cover ? [getImageUrl(form.cover)] : [];
  const existingImages = form.images && form.images.length > 0 ? form.images.map(img => getImageUrl(img)) : [];

  return (
    <form onSubmit={handleSubmit} className={`p-8 rounded-2xl w-full max-w-7xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Titre *</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
        <div>
          <MediaUpload
            images={coverFiles}
            setImages={setCoverFiles}
            existingImages={existingCover}
            label="Image de couverture"
          />
        </div>
        <div>
          <MediaUpload
            images={imageFiles}
            setImages={setImageFiles}
            existingImages={existingImages}
            label="Images supplémentaires (max 10)"
          />
        </div>
        
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
        <RichTextEditor
          value={form.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Rédigez votre article..."
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
export default BlogForm; 
