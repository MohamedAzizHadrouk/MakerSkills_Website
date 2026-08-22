import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { Product, CreateProductDto } from "../types/product";
import MediaUpload from "../../../../shared/components/MediaUpload";
import RichTextEditor from "../../../../shared/components/RichTextEditor";
import axios from "axios";
import Select from "react-select";

interface ProductFormProps {
  editingProduct: Product | null;
  formData: CreateProductDto;
  setFormData: (data: CreateProductDto) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  categories: { id: string; label: string }[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  formData,
  setFormData,
  imageFiles,
  setImageFiles,
  videoFile,
  setVideoFile,
  categories,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { theme } = useStore();
  const [formError, setFormError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/events`).then((res) => {
      setEvents(res.data.data || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await onSubmit(e);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {editingProduct ? "Modifier le Produit" : "Nouveau Produit"}
          </h1>
        </div>
        <button
          onClick={onCancel}
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark"
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Error Display */}
      {formError && (
        <div
          className={`p-4 rounded-lg ${
            theme === "dark"
              ? "bg-red-900/20 border-red-800"
              : "bg-red-50 border-red-200"
          } border`}
        >
          <p
            className={`text-sm ${
              theme === "dark" ? "text-red-300" : "text-red-700"
            }`}
          >
            {formError}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg space-y-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Catégorie *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Prix (DT) *
            </label>
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Formations liées (Events)
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
              placeholder="Sélectionner des formations..."
              noOptionsMessage={() => "Aucune formation disponible"}
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
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Description
          </label>
          <RichTextEditor
            value={formData.description || ""}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            placeholder="Décrivez votre produit en détail..."
          />
        </div>

        <MediaUpload
          images={imageFiles}
          setImages={setImageFiles}
          showVideo={true}
          video={videoFile}
          setVideo={setVideoFile}
          existingImages={editingProduct?.images}
          existingVideo={editingProduct?.video}
          label="Images du produit"
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
            {loading
              ? "Enregistrement..."
              : editingProduct
              ? "Modifier"
              : "Créer"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
