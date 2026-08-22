import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

interface CategoryFormProps {
  editingCategory: Category | null;
  formData: CreateCategoryDto;
  setFormData: (data: CreateCategoryDto) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { theme } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
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

      <form
        onSubmit={onSubmit}
        className={`p-8 rounded-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-lg space-y-6`}
      >
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Nom de la catégorie *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Description de la catégorie..."
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Type de catégorie *
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "product" | "event",
              })
            }
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          >
            <option value="" disabled>
              Sélectionner un type
            </option>
            <option value="product">Produit</option>
            <option value="event">Événement</option>
          </select>
        </div>

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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Sauvegarde..."
              : editingCategory
              ? "Mettre à jour"
              : "Créer la catégorie"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
