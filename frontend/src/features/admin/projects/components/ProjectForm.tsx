import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "../../../../stores/useStore";
import { CreateProjectDto, Project } from "../types/project";
import MediaUpload from "../../../../shared/components/MediaUpload";
import Select from "react-select";
import { categoryService } from "../../categories";
import { X } from "lucide-react";

interface ProjectFormProps {
  editingProject: Project | null;
  formData: CreateProjectDto;
  setFormData: (data: CreateProjectDto) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  editingProject,
  formData,
  setFormData,
  imageFile,
  setImageFile,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { theme } = useStore();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [techInput, setTechInput] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);
    await onSubmit(e);
  };

  useEffect(() => {
    categoryService
      .getCategories()
      .then((categories) => {
        const transformedCategories = categories.map((category) => ({
          value: category._id,
          label: category.name,
        }));
        setCategories(transformedCategories);
        if (editingProject) {
          console.log("edit cat", editingProject?.categories);
          setFormData((prev) => {
            return {
              ...prev,
              categories: editingProject.categories?.map((cat) => cat?._id),
            };
          });
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des catégories:", error);
        setCategories([]);
      });
  }, []);

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTechInput(value);

    // Mise à jour en temps réel avec séparation par virgules
    if (value.endsWith(",")) {
      const newTechs = [
        ...formData.technologies,
        value.slice(0, -1).trim(),
      ].filter(Boolean);
      setFormData({ ...formData, technologies: newTechs });
      setTechInput("");
    }
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTechs = [...formData.technologies, techInput.trim()].filter(
        Boolean
      );
      setFormData({ ...formData, technologies: newTechs });
      setTechInput("");
    }
  };

  const removeTech = (index: number) => {
    const newTechs = [...formData.technologies];
    newTechs.splice(index, 1);
    setFormData({ ...formData, technologies: newTechs });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        theme === "dark" ? "bg-black/50" : "bg-black/30"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl rounded-2xl shadow-xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {editingProject ? "Modifier le projet" : "Créer un projet"}
            </h2>
            <button
              onClick={onCancel}
              className={`p-1 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X
                className={`h-5 w-5 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Champ Nom */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nom du projet *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
              </div>

              {/* Champ Description */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
              </div>

              {/* Champ Technologies */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Technologies *
                </label>
                <div
                  className={`relative ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } border rounded-lg p-2`}
                >
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          theme === "dark"
                            ? "bg-gray-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(index)}
                          className="ml-2 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={techInput}
                    onChange={handleTechChange}
                    onKeyDown={handleTechKeyDown}
                    placeholder="Ajouter une technologie (séparer par virgules)"
                    className={`w-full px-4 py-2 bg-transparent focus:outline-none ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  />
                </div>
              </div> 

              {/* Champ Image de couverture */}
              {!editingProject && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Image de couverture *
                  </label>
                  <MediaUpload
                    images={
                      imageFile
                        ? [imageFile]
                        : formData.coverImage
                        ? [formData.coverImage as unknown as File]
                        : []
                    }
                    setImages={(files) => setImageFile(files[0] || null)}
                    showVideo={false}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className={`px-6 py-3 rounded-lg font-medium ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
                disabled={loading}
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {loading
                  ? "Enregistrement..."
                  : editingProject
                  ? "Modifier le projet"
                  : "Créer le projet"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectForm;
