import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye } from "lucide-react";
import { getImageUrl } from "../../../../shared/utils/imageUtils";

interface Module {
  title: string;
  items: string[];
  _id: string;
}

interface Bootcamp {
  modules: Module[];
  type?: string;
  name: string;
  price: string | number;
  reduction?: number;
  duration?: string;
  periode: string;
  startDate?: string | null;
  required?: string[];
  includedInEvent?: string[];
  objectives?: string[];
  location: string;
  certification: boolean;
  products: string[];
  coverImage: string | null;
  participants?: any[];
  animator: string;
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface BootcampCardProps {
  bootcamp: Bootcamp;
  theme: "light" | "dark";
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (bootcamp: Bootcamp) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const BootcampCard: React.FC<BootcampCardProps> = ({
  bootcamp,
  theme,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onView,
}) => {
  const getBootcampImageUrl = (imagePath?: string | null): string => {
    if (!imagePath) {
      return "/placeholder-bootcamp.png";
    }
    return getImageUrl(imagePath);
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Non spécifié";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  };

  const getLocationText = (location: string): string => {
    switch (location) {
      case "in_person":
        return "En présentiel";
      case "online":
        return "En ligne";
      case "hybrid":
        return "Hybride";
      default:
        return location;
    }
  };

  const calculateFinalPrice = (
    price: string | number,
    reduction = 0
  ): number => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return numericPrice - (numericPrice * reduction) / 100;
  };

  const price =
    typeof bootcamp.price === "string"
      ? parseFloat(bootcamp.price)
      : bootcamp.price;
  const reduction = bootcamp.reduction || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl shadow-lg overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="relative">
        <img
          src={getBootcampImageUrl(bootcamp.coverImage)}
          alt={bootcamp.name}
          className="w-full h-48 object-cover"
        />
        {bootcamp.type && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {bootcamp.type}
            </span>
          </div>
        )}
        {bootcamp.certification && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Certification
          </span>
        )}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(bootcamp._id)}
            className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
          />
          <button
            onClick={() => onEdit(bootcamp)}
            className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(bootcamp._id)}
            className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3
          className={`text-xl font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {bootcamp.name}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {bootcamp.periode} Jours
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Durée
            </div>
          </div>

          <div>
            <div
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {getLocationText(bootcamp.location)}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Format
            </div>
          </div>

          <div>
            <div
              className={`text-sm font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {bootcamp.animator || "Animateur non spécifié"}
            </div>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Animateur
            </div>
          </div>
        </div>

        {bootcamp.modules?.length > 0 && (
          <div className="mb-4">
            <h4
              className={`text-sm font-medium mb-1 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Modules:
            </h4>
            <ul
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {bootcamp.modules.map((module, index) => (
                <li key={module._id} className="mb-1">
                  • {module.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {reduction > 0 && (
              <span
                className={`text-sm line-through ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {price} DT
              </span>
            )}
            <span
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {calculateFinalPrice(price, reduction)} DT
            </span>
            {reduction > 0 && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                -{reduction}%
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(bootcamp._id)}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Voir Détails</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(bootcamp)}
            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Modifier
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BootcampCard;
