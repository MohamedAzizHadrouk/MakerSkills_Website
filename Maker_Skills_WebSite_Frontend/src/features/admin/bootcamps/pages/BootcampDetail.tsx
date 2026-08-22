import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  User,
  Tag,
  Package,
  Euro,
} from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { bootcampService } from "../services/bootcamp.service";
import { useSelections } from "../hooks/useSelections";
import { getImageUrl } from "../../../../shared/utils/imageUtils";
import AnimatedSection from "../../../../components/UI/AnimatedSection";

const BootcampDetail: React.FC = () => {
  const { theme } = useStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bootcamp, setBootcamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCategoriesForComponents } = useSelections();

  useEffect(() => {
    const loadBootcamp = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await bootcampService.getBootcamp(id);
        console.log("event", data);
        setBootcamp(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBootcamp();
  }, [id]);

  const getCategoryName = (category: any): string => {
    if (!category) return "Aucune catégorie";
    return typeof category === "string"
      ? category
      : category.name || "Catégorie inconnue";
  };

  const getBootcampImageUrl = (imagePath?: string): string => {
    if (!imagePath) {
      return "/placeholder-bootcamp.png";
    }
    return getImageUrl(imagePath);
  };

  const handleEdit = () => {
    navigate("/admin/bootcamps", {
      state: {
        editBootcamp: bootcamp,
        showForm: true,
      },
    });
  };

  const handleBack = () => {
    navigate("/admin/bootcamps");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-8">
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-orange-500 border-t-transparent rounded-full" />
            <p>Chargement du bootcamp...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-8">
          <div
            className={`text-center py-12 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Erreur</h3>
            <p>{error || "Bootcamp non trouvé"}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft className="h-6 w-6" />
              </motion.button>
              <div>
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {bootcamp.name}
                </h1>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Détails du bootcamp
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Edit className="h-5 w-5" />
              <span>Modifier</span>
            </motion.button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cover Image - Only show if coverImage exists */}
          {bootcamp.coverImage && (
            <AnimatedSection>
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <img
                  src={getBootcampImageUrl(bootcamp.coverImage)}
                  alt={bootcamp.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            </AnimatedSection>
          )}

          {/* Bootcamp Info */}
          <AnimatedSection delay={0.1}>
            <div
              className={`p-8 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="space-y-6">
                {/* Type - Only show if type exists */}
                {bootcamp.type && (
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Tag className="h-5 w-5 mr-2" />
                      Type
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {bootcamp.type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Duration - Only show if duration exists */}
                {bootcamp.duration && (
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Durée
                    </h3>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {bootcamp.duration} jours
                    </div>
                  </div>
                )}

                {/* Location - Only show if location exists */}
                {bootcamp.location && (
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Localisation
                    </h3>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {bootcamp.location === "in_person"
                        ? "En personne"
                        : "En ligne"}
                    </div>
                  </div>
                )}

                {/* Instructor - Only show if instructor exists */}
                {(bootcamp.instructor?.name || bootcamp.instructor?.title) && (
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Instructeur
                    </h3>
                    {bootcamp.instructor?.name && (
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {bootcamp.instructor.name}
                      </div>
                    )}
                    {bootcamp.instructor?.title && (
                      <div
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {bootcamp.instructor.title}
                      </div>
                    )}
                  </div>
                )}

                {/* Category and Price */}
                <div className="flex items-center justify-between">
                  {/* Category - Only show if category exists */}
                  {bootcamp.category && (
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Catégorie
                      </h3>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {getCategoryName(bootcamp.category)}
                      </div>
                    </div>
                  )}

                  {/* Price - Only show if price exists */}
                  {bootcamp.price !== undefined && (
                    <div className="text-right">
                      <h3
                        className={`text-lg font-semibold mb-2 flex items-center justify-end ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Prix
                      </h3>
                      <div
                        className={`text-2xl font-bold ${
                          theme === "dark"
                            ? "text-orange-400"
                            : "text-orange-600"
                        }`}
                      >
                        {bootcamp.price} DT
                        {bootcamp.reduction && (
                          <span className="text-sm line-through ml-2 text-gray-500">
                            {Math.round(
                              (bootcamp.price * 100) /
                                (100 - bootcamp.reduction)
                            )}
                            DT
                          </span>
                        )}
                      </div>
                      {bootcamp.reduction && (
                        <div className="text-sm text-green-500">
                          {bootcamp.reduction}% de réduction
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Modules - Only show if modules exist and are not empty */}
        {bootcamp.modules?.length > 0 && (
          <AnimatedSection delay={0.2}>
            <div
              className={`mt-8 p-8 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Modules
              </h3>
              <div className="space-y-4">
                {bootcamp.modules.map((module: any) => (
                  <div
                    key={module._id}
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {module.title ? (
                      <h4
                        className={`font-semibold mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {module.title}
                      </h4>
                    ) : (
                      "Non specifié"
                    )}
                    {module.items?.length > 0 && (
                      <ul className="list-disc pl-5">
                        {module.items.map((item: string, itemIndex: number) => (
                          <li
                            key={itemIndex}
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Associated Product - Only show if products exists */}
        {bootcamp.products?.length > 0 && (
          <AnimatedSection delay={0.3}>
            <div
              className={`mt-8 p-8 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-6 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <Package className="h-6 w-6 mr-2" />
                Produits associés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bootcamp.products.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-lg overflow-hidden shadow-md transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {product.images?.[0] && (
                      <div className="relative h-48">
                        <img
                          src={getBootcampImageUrl(product.images[0])}
                          alt={product.name || "Produit associé"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {product.name && (
                        <h4
                          className={`font-semibold mb-2 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {product.name}
                        </h4>
                      )}
                      {product.price !== undefined && (
                        <div
                          className={`text-lg font-bold ${
                            theme === "dark"
                              ? "text-orange-400"
                              : "text-orange-600"
                          }`}
                        >
                          {product.price} DT
                        </div>
                      )}
                      {product.description && (
                        <div
                          className={`mt-2 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Objectives and Requirements */}
        {(bootcamp.objectives?.length > 0 || bootcamp.required?.length > 0) && (
          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Objectives - Only show if objectives exist */}
              {bootcamp.objectives?.length > 0 && (
                <div
                  className={`p-8 rounded-xl shadow-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Objectifs
                  </h3>
                  <ul className="space-y-2">
                    {bootcamp.objectives.map((obj: string, index: number) => (
                      <li
                        key={index}
                        className={`flex items-start ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span className="mr-2">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements - Only show if required exist */}
              {bootcamp.required?.length > 0 && (
                <div
                  className={`p-8 rounded-xl shadow-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Prérequis
                  </h3>
                  <ul className="space-y-2">
                    {bootcamp.required.map((req: string, index: number) => (
                      <li
                        key={index}
                        className={`flex items-start ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span className="mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Additional Information */}
        <AnimatedSection delay={0.5}>
          <div
            className={`mt-8 p-8 rounded-xl shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Informations supplémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certification - Always show */}
              <div>
                <h4
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Certification
                </h4>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {bootcamp.certification ? "Oui" : "Non"}
                </div>
              </div>

              {/* Included in Event - Only show if includedInEvent exists */}
              <div>
                <h4
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Inclus dans l'événement
                </h4>
                {bootcamp.includedInEvent?.length > 0 ? (
                  <ul className="space-y-1">
                    {bootcamp.includedInEvent.map(
                      (item: string, index: number) => (
                        <li
                          key={index}
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          • {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Non spécifié
                  </div>
                )}
              </div>

              {/* Created At - Always show */}
              <div>
                <h4
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Date de création
                </h4>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {new Date(bootcamp.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>

              {/* Updated At - Always show */}
              <div>
                <h4
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Dernière modification
                </h4>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {new Date(bootcamp.updatedAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BootcampDetail;
