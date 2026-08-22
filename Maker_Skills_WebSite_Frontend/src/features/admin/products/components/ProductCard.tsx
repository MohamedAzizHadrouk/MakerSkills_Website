import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { Product } from "../types/product";
import { getProductImageUrl } from "../../../../shared/utils/imageUtils";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  index,
}) => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || "/placeholder-product.png";

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const truncateDescription = (text: string, maxLines: number = 2) => {
    if (!text) return "";
    const lines = text.split("\n");
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join("\n") + "...";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Ne pas naviguer si on clique sur les boutons d'action
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("input")
    ) {
      return;
    }
    navigate(`/admin/products/${product._id}`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/products/${product._id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product._id);
  };

  const handleSelectClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } group relative cursor-pointer ${
        isSelected
          ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20"
          : ""
      }`}
    >
      {/* Selection checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectClick}
          className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="relative">
        <img
          src={getProductImageUrl(currentImage)}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Video indicator */}
        {product.video && (
          <div className="absolute top-4 left-12 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Vidéo
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <button
              onClick={handleViewClick}
              className="p-2 bg-white dark:bg-gray-800 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-lg"
              title="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleEditClick}
              className="p-2 bg-white dark:bg-gray-800 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-lg"
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white dark:bg-gray-800 rounded-full text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors shadow-lg"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3
            className={`text-lg font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {product.name}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.category
              ? typeof product.category === "string"
                ? product.category
                : product.category.name
              : "Aucune catégorie"}
          </span>
        </div>
        <div
          className={`text-sm mb-4 line-clamp-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
          dangerouslySetInnerHTML={{
            __html: truncateDescription(product.description || ""),
          }}
        />
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {product.price}DT
          </span>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            {images.length > 0 && (
              <span>
                {images.length} image{images.length > 1 ? "s" : ""}
              </span>
            )}
            {product.video && <span>• Vidéo</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
