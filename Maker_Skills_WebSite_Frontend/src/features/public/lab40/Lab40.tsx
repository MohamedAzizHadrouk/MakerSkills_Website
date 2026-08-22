import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../../../stores/useStore";
import { LaboratoryService } from "../../admin/laboratories/services/laboratory.service";
import { Laboratory } from "../../admin/laboratories/types/laboratory";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import AnimatedSection from "../../../components/UI/AnimatedSection";
import { routes, getEntitySlug } from "../../../shared/routes";

const Lab40: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [disableReason, setDisableReason] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Vérifier d'abord le statut de la fonctionnalité
        const featureStatus = await LaboratoryService.getFeatureStatus();
        if (!featureStatus.isEnabled) {
          setFeatureDisabled(true);
          setDisableReason(featureStatus.reason);
          setError("Cette rubrique est actuellement indisponible.");
          return;
        }
        
        const data = await LaboratoryService.getAll();
        setLaboratories(data);
        setError(null);
        setFeatureDisabled(false);
        setDisableReason(undefined);
      } catch (err: any) {
        console.error("Error fetching laboratories:", err);
        // Vérifier si l'erreur est liée au statut désactivé
        if (err?.response?.status === 503) {
          const reason = err?.response?.data?.reason;
          setFeatureDisabled(true);
          setDisableReason(reason);
          setError("Cette rubrique est actuellement indisponible.");
        } else {
          setError("Erreur lors du chargement des laboratoires.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReserve = (laboratory: Laboratory) => {
    navigate(routes.labReservation(getEntitySlug(laboratory)));
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-white"} transition-colors duration-300`}>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <div className={`w-full h-full ${theme === "dark" ? "bg-gray-800" : "bg-gradient-to-r from-blue-600 to-blue-800"}`} />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Lab 4.0
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90 leading-relaxed">
              Espace de Prototypage - Construisez des prototypes innovants en quelques heures
            </p>
          </div>
        </div>
      </section>

      {/* Laboratories Grid */}
      <section className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Nos Laboratoires
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Découvrez nos espaces de prototypage équipés des dernières technologies
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Chargement des laboratoires...
              </p>
            </div>
          ) : error && featureDisabled ? (
            <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
                {error}
              </div>
              {disableReason && (
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Motif de l'indisponibilité :
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {disableReason}
                  </p>
                </div>
              )}
              <p className="mt-4 text-yellow-700 dark:text-yellow-300 text-sm">
                Veuillez contacter notre équipe de support pour plus d'informations.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-lg font-semibold mb-2 text-red-500">
                {error}
              </div>
            </div>
          ) : laboratories.length === 0 ? (
            <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Aucun laboratoire disponible.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {laboratories.map((laboratory) => (
                <AnimatedSection key={laboratory._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                      theme === "dark" ? "bg-gray-900" : "bg-white"
                    } border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} flex flex-col h-full`}
                  >
                    {/* Image */}
                    <div className={`relative h-64 overflow-hidden flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                    }`}>
                      <img
                        src={getImageUrl(laboratory.coverImagePath || laboratory.imageUrl)}
                        alt={laboratory.title}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className={`text-xl font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {laboratory.title}
                      </h3>

                      {laboratory.description && (
                        <p className={`text-sm mb-4 flex-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                          {laboratory.description}
                        </p>
                      )}

                      {/* Reserve Button */}
                      <button
                        onClick={() => handleReserve(laboratory)}
                        className="w-full mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Réserver
                      </button>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Lab40;

