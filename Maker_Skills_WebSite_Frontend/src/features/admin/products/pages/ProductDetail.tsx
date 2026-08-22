import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { Product } from "../types/product";
import { productService } from "../services/product.service";
import { getProductImageUrl } from "../../../../shared/utils/imageUtils";
import { ConfirmDialog } from "../../../../shared";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setIsVideoPlaying] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    try {
      await productService.deleteProduct(product._id);
      navigate("/admin/products");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleEdit = () => {
    if (!product) return;
    navigate("/admin/products", {
      state: {
        editProduct: product,
        showForm: true,
      },
    });
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images!.length) % product.images!.length
      );
    }
  };

 

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {error || "Produit non trouvé"}
          </p>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || "/placeholder-product.png";

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/products")}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h1>
              <p
                className={`mt-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Détails du produit
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <div className="relative">
                <img
                  src={getProductImageUrl(currentImage)}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            idx === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Video */}
            {product.video && (
              <div className="relative">
                <video
                  src={getProductImageUrl(product.video)}
                  controls
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Vidéo du produit
                </div>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-blue-500 scale-105"
                        : "hover:scale-105"
                    }`}
                  >
                    <img
                      src={getProductImageUrl(image)}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div
            className={`p-8 rounded-2xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg space-y-6`}
          >
            <div>
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h2>
              <div className="flex items-center space-x-4">
                <span className={`text-3xl font-bold text-orange-500`}>
                  {product.price}DT
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>

            <div>
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Description
              </h3>
              <div
                className={`prose max-w-none ${
                  theme === "dark" ? "prose-invert" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html:
                    product.description || "Aucune description disponible.",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Images
                </h4>
                <p
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {images.length}
                </p>
              </div>
              <div>
                <h4
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Vidéo
                </h4>
                <p
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {product.video ? "Oui" : "Non"}
                </p>
              </div>
            </div>

            {product.createdAt && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Créé le{" "}
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}

            {/* Section Formations liées */}
            {product.events && product.events.length > 0 && (
              <div className="mt-8">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Formations liées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.events.map((event) => (
                    <div
                      key={typeof event === "string" ? event : event._id}
                      className={`p-4 rounded-lg border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <h4
                        className={`font-medium mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {typeof event === "string" ? event : event.name}
                      </h4>
                      {typeof event !== "string" && event.description && (
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {event.description}
                        </p>
                      )}
                      {typeof event !== "string" && event.price && (
                        <p
                          className={`text-sm font-medium text-orange-500 mt-2`}
                        >
                          {event.price}DT
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${product.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
};

export default ProductDetail;
