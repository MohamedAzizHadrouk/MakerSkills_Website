import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ServiceFormProps, Category, Event, Project } from '../types/service';
import { ServiceService } from '../services/service.service';
import RichTextEditor from '../../../../shared/components/RichTextEditor';
import MediaUpload from '../../../../shared/components/MediaUpload';
import { Product } from '../../products';
import Select from "react-select";

const ServiceForm: React.FC<ServiceFormProps> = ({
  theme,
  editingService,
  loading,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  imageFiles,
  setImageFiles
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Charger les catégories, events, projects, products au montage du composant
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, eventsData, projectsData, productsData] = await Promise.all([
          ServiceService.getCategories(),
          ServiceService.getEvents(),
          ServiceService.getProjects(),
          ServiceService.getProducts(),
        ]);
        setCategories(categoriesData);
        setEvents(eventsData);
        setProjects(projectsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    loadData();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleEventsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, events: selected });
  };
  const handleProjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, projects: selected });
  };
  const handleProductsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, products: selected });
  };

  const handleRemoveExistingImage = (index: number) => {
    console.log('Suppression image existante:', index);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {editingService ? 'Modifier le Service' : 'Nouveau Service'}
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
              Nom du service *
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

         
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Catégories *
          </label>
          <Select
            isMulti
            name="categories"
            options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
            value={categories
              .filter((cat) => formData.categories?.includes(cat._id))
              .map((cat) => ({ value: cat._id, label: cat.name }))}
            onChange={(selected) => {
              setFormData({
                ...formData,
                categories: selected.map((option) => option.value),
              });
            }}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionner des catégories..."
            noOptionsMessage={() => "Aucune catégorie disponible"}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
                color: theme === "dark" ? "white" : "black",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                color: theme === "dark" ? "white" : "black",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: theme === "dark" ? "white" : "black",
              }),
            }}
          />
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs catégories
          </p>
        </div>

        {/* SELECT EVENTS */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Événements liés (optionnel)
          </label>
          <Select
            isMulti
            name="events"
            options={events.map((ev) => ({ value: ev._id, label: ev.name }))}
            value={events
              .filter((ev) => formData.events?.includes(ev._id))
              .map((ev) => ({ value: ev._id, label: ev.name }))}
            onChange={(selected) => {
              setFormData({
                ...formData,
                events: selected.map((option) => option.value),
              });
            }}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionner des événements..."
            noOptionsMessage={() => "Aucun événement disponible"}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
                color: theme === "dark" ? "white" : "black",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                color: theme === "dark" ? "white" : "black",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: theme === "dark" ? "white" : "black",
              }),
            }}
          />
        </div>

        {/* SELECT PROJECTS */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Projets liés (optionnel)
          </label>
          <Select
            isMulti
            name="projects"
            options={projects.map((proj) => ({ value: proj._id, label: proj.name }))}
            value={projects
              .filter((proj) => formData.projects?.includes(proj._id))
              .map((proj) => ({ value: proj._id, label: proj.name }))}
            onChange={(selected) => {
              setFormData({
                ...formData,
                projects: selected.map((option) => option.value),
              });
            }}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionner des projets..."
            noOptionsMessage={() => "Aucun projet disponible"}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
                color: theme === "dark" ? "white" : "black",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                color: theme === "dark" ? "white" : "black",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: theme === "dark" ? "white" : "black",
              }),
            }}
          />
        </div>

        {/* SELECT PRODUCTS */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Produits liés (optionnel)
          </label>
          <Select
            isMulti
            name="products"
            options={products.map((prod) => ({ value: prod._id, label: prod.name }))}
            value={products
              .filter((prod) => formData.products?.includes(prod._id))
              .map((prod) => ({ value: prod._id, label: prod.name }))}
            onChange={(selected) => {
              setFormData({
                ...formData,
                products: selected.map((option) => option.value),
              });
            }}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionner des produits..."
            noOptionsMessage={() => "Aucun produit disponible"}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
                color: theme === "dark" ? "white" : "black",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#374151" : "white",
                color: theme === "dark" ? "white" : "black",
                "&:hover": {
                  backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: theme === "dark" ? "white" : "black",
              }),
            }}
          />
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
            placeholder="Décrivez votre service..."
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="isActive" className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Service actif
          </label>
        </div>

        {/* Media Upload Component */}
        <MediaUpload
          images={imageFiles}
          setImages={setImageFiles}
          existingImages={editingService?.coverImagePath ? [editingService.coverImagePath] : []}
          onRemoveExistingImage={handleRemoveExistingImage}
          label="Images du service"
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
            {loading ? 'Enregistrement...' : (editingService ? 'Modifier' : 'Créer')}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm; 