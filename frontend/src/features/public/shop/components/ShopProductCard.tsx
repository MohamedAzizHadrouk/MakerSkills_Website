import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Product } from "../../../admin/products/types/product";
import { getImageUrl } from "../../../../shared/utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { routes, getEntitySlug } from "../../../../shared/routes";

interface ShopProductCardProps {
  product: (Product & {
    image: string;
    featured?: boolean;
    originalPrice?: number;
    inStock?: boolean;
    rating?: number;
    reviews?: number;
    tags?: string[];
  });
  theme: "light" | "dark";
  viewMode: "grid" | "list";
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({
  product,
  theme,
  viewMode,
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
    onClick={() => navigate(routes.product(getEntitySlug(product)))}
      whileHover={{ y: -5 }}
      className={`rounded-2xl shadow-lg overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } group ${
        viewMode === "list" 
          ? "flex flex-row items-stretch mb-4" 
          : "flex flex-col mb-4 w-full sm:w-64 md:w-72"
      }`}
      style={viewMode === "list" ? { height: '200px' } : { height: '500px' }}
    >
      {/* Image Container */}
      <div
        className={`relative ${
          viewMode === "list"
            ? "w-50 sm:w-50 h-full flex-shrink-0"
            : "h-72 w-full flex-shrink-0"
        }`}
      >
        <div className="w-full h-full overflow-hidden bg-white">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className={`w-full h-full transition-transform duration-300 ${
              viewMode === "list" ? "object-cover" : "object-contain mx-auto"
            }`}
          />
        </div>
        
        {/* Badges */}
        {product.featured && (
          <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Populaire
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
        {product.inStock === false && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Précommande
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => navigate(routes.product(getEntitySlug(product)))}
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className={`p-4 flex flex-col justify-between ${viewMode === "list" ? "flex-1" : ""}`}>
        {/* Title */}
        <h3
          className={`text-lg font-bold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          } ${viewMode === "list" ? "line-clamp-1" : "line-clamp-2"}`}
        >
          {product.name}
        </h3>
        
        {/* Description */}
        <div
          className={`text-sm mb-3 ${
            viewMode === "list" ? "line-clamp-2" : "line-clamp-3"
          } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: viewMode === "list" ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
        
        {/* Rating */}
      
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags?.slice(0, 2).map((tag: string, idx: number) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-full text-xs ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <span
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {product.price}DT
            </span>
            {product.originalPrice && (
              <span
                className={`text-sm line-through ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {product.originalPrice}DT
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopProductCard;