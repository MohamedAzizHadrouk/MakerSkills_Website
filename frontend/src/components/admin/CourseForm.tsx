import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Upload, Plus, Trash2 } from "lucide-react";
import { useStore } from "../../stores/useStore";

interface CourseFormProps {
  course?: any;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const { theme, addCourse, updateCourse } = useStore();
  const isEditing = !!course;

  const [formData, setFormData] = useState({
    title: { fr: "", en: "" },
    description: { fr: "", en: "" },
    image: "",
    category: "iot",
    type: "adults",
    duration: "",
    price: 0,
    level: "beginner",
    featured: false,
    curriculum: [{ week: 1, title: "", topics: [""] }],
    prerequisites: [""],
    outcomes: [""],
    instructor: {
      name: "",
      title: "",
      image: "",
      experience: "",
      students: "",
    },
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || { fr: "", en: "" },
        description: course.description || { fr: "", en: "" },
        image: course.image || "",
        category: course.category || "iot",
        type: course.type || "adults",
        duration: course.duration || "",
        price: course.price || 0,
        level: course.level || "beginner",
        featured: course.featured || false,
        curriculum: course.curriculum || [{ week: 1, title: "", topics: [""] }],
        prerequisites: course.prerequisites || [""],
        outcomes: course.outcomes || [""],
        instructor: course.instructor || {
          name: "",
          title: "",
          image: "",
          experience: "",
          students: "",
        },
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      ...formData,
      id: course?.id || Date.now().toString(),
    };

    if (isEditing) {
      updateCourse(course.id, courseData);
    } else {
      addCourse(courseData);
    }

    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (field: string, subfield: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  const addCurriculumWeek = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        { week: prev.curriculum.length + 1, title: "", topics: [""] },
      ],
    }));
  };

  const removeCurriculumWeek = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const addTopic = (weekIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((week, i) =>
        i === weekIndex ? { ...week, topics: [...week.topics, ""] } : week
      ),
    }));
  };

  const removeTopic = (weekIndex: number, topicIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.map((week, i) =>
        i === weekIndex
          ? { ...week, topics: week.topics.filter((_, j) => j !== topicIndex) }
          : week
      ),
    }));
  };

  const addListItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div
      className={`min-h-screen pt-16 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        <div
          className={`max-w-4xl mx-auto ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h1
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {isEditing ? "Modifier la Formation" : "Nouvelle Formation"}
            </h1>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Informations de base
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Titre (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.fr}
                    onChange={(e) =>
                      handleNestedChange("title", "fr", e.target.value)
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
                    Titre (Anglais) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title.en}
                    onChange={(e) =>
                      handleNestedChange("title", "en", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description (Français) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description.fr}
                    onChange={(e) =>
                      handleNestedChange("description", "fr", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
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
                    Description (Anglais) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description.en}
                    onChange={(e) =>
                      handleNestedChange("description", "en", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
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
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  >
                    <option value="iot">IoT</option>
                    <option value="robotics">Robotique</option>
                    <option value="ai">Intelligence Artificielle</option>
                    <option value="programming">Programmation</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  >
                    <option value="kids">Enfants</option>
                    <option value="adults">Adultes</option>
                    <option value="bootcamp">Bootcamp</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Niveau *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => handleChange("level", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Durée *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 8 semaines"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
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
                    Prix (DT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      handleChange("price", parseInt(e.target.value))
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
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleChange("image", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange("featured", e.target.checked)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Formation populaire
                  </span>
                </label>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <h2
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Prérequis
              </h2>

              {formData.prerequisites.map((prereq, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={prereq}
                    onChange={(e) =>
                      updateListItem("prerequisites", index, e.target.value)
                    }
                    placeholder="Prérequis..."
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem("prerequisites", index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addListItem("prerequisites")}
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un prérequis</span>
              </button>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h2
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Objectifs d'apprentissage
              </h2>

              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) =>
                      updateListItem("outcomes", index, e.target.value)
                    }
                    placeholder="Objectif d'apprentissage..."
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem("outcomes", index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addListItem("outcomes")}
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un objectif</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
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
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>{isEditing ? "Mettre à jour" : "Créer"}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
