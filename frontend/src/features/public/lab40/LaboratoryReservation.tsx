import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useStore } from "../../../stores/useStore";
import { LaboratoryService, CreateLaboratoryReservationDto } from "../../admin/laboratories/services/laboratory.service";
import { Laboratory, Material } from "../../admin/laboratories/types/laboratory";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import AnimatedSection from "../../../components/UI/AnimatedSection";
import { routes, getEntitySlug } from "../../../shared/routes";
import { useCanonicalSlugRedirect } from "../../../shared/useCanonicalSlugRedirect";
import { PageMeta } from "../../../shared/PageMeta";

const LaboratoryReservation: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [laboratory, setLaboratory] = useState<Laboratory | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [disableReason, setDisableReason] = useState<string | undefined>(undefined);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    notes: "",
    reservationDate: "",
    startTime: "",
    endTime: "",
  });

  useCanonicalSlugRedirect(slug, laboratory?.slug, routes.labReservation);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
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
        
        const [labData, materialsData] = await Promise.all([
          LaboratoryService.getById(slug),
          LaboratoryService.getMaterials(slug),
        ]);
        
        setLaboratory(labData);
        setMaterials(materialsData.filter(m => m.status === 'available'));
        setError(null);
      } catch (err: any) {
        console.error("Error fetching laboratory data:", err);
        // Vérifier si l'erreur est liée au statut désactivé
        if (err?.response?.status === 503) {
          const reason = err?.response?.data?.reason;
          setFeatureDisabled(true);
          setDisableReason(reason);
          setError("Cette rubrique est actuellement indisponible.");
        } else {
          setError("Erreur lors du chargement des données du laboratoire.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!laboratory || !id) return;
    
    setSubmitting(true);
    
    try {
      const reservationData: CreateLaboratoryReservationDto = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        materials: selectedMaterials,
        reservationDate: formData.reservationDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes || undefined,
      };

      await LaboratoryService.createReservation(slug!, reservationData);
      
      alert(`Réservation effectuée avec succès pour le laboratoire ${laboratory.title}`);
      navigate("/lab40");
    } catch (err: any) {
      console.error("Error submitting reservation:", err);
      let errorMessage = err?.message || "Erreur lors de la réservation. Veuillez réessayer.";
      // Vérifier si l'erreur est liée au statut désactivé
      if (err?.response?.status === 503 || err?.response?.data?.message?.includes("problème dans cette rubrique")) {
        errorMessage = "Il y a un problème dans cette rubrique. Veuillez contacter le support.";
        setFeatureDisabled(true);
      }
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (error || !laboratory) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div className={`text-center max-w-2xl mx-auto px-4 ${featureDisabled ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8' : ''}`}>
          <p className={`text-xl font-semibold mb-4 ${featureDisabled ? (theme === "dark" ? "text-yellow-400" : "text-yellow-800") : (theme === "dark" ? "text-red-400" : "text-red-600")}`}>
            {error || "Laboratoire non trouvé"}
          </p>
          {featureDisabled && disableReason && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                Motif de l'indisponibilité :
              </p>
              <p className="text-yellow-800 dark:text-yellow-200">
                {disableReason}
              </p>
            </div>
          )}
          {featureDisabled && (
            <p className={`mb-4 ${theme === "dark" ? "text-yellow-300" : "text-yellow-700"} text-sm`}>
              Veuillez contacter notre équipe de support pour plus d'informations.
            </p>
          )}
          <button
            onClick={() => navigate("/lab40")}
            className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const selectedMaterialsData = materials.filter(m => selectedMaterials.includes(m._id));
  
  // Calculer le nombre d'heures entre startTime et endTime
  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    const diffMinutes = endTotalMinutes - startTotalMinutes;
    const hours = diffMinutes / 60;
    
    return Math.max(0, hours); // Retourner au minimum 0
  };
  
  const hours = calculateHours();
  
  // Calculer le coût total exact
  const calculateTotalCost = () => {
    if (hours <= 0) return 0;
    
    // Coût du laboratoire = tarif horaire × nombre d'heures
    const laboratoryCost = (laboratory.hourlyRate || 0) * hours;
    
    // Coût des matériels = somme de (tarif horaire × nombre d'heures) pour chaque matériel non gratuit
    const materialsCost = selectedMaterialsData.reduce((sum, material) => {
      if (!material.isFree && material.hourlyRate) {
        return sum + (material.hourlyRate * hours);
      }
      return sum;
    }, 0);
    
    // Total = coût laboratoire + coût matériels
    return laboratoryCost + materialsCost;
  };
  
  const totalCost = calculateTotalCost();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}>
      <PageMeta
        title={`Réservation - ${laboratory.title}`}
        description={laboratory.description}
        canonicalPath={routes.labReservation(getEntitySlug(laboratory))}
      />
      {/* Header */}
      <section className={`py-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"} border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/lab40")}
            className={`flex items-center space-x-2 mb-4 ${
              theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
            } transition-colors`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          
          <h1 className={`text-3xl md:text-4xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Réservation - {laboratory.title}
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Laboratory Info */}
            <AnimatedSection>
              <div className={`rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                {/* Text Content - Left */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <h2 className={`text-2xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {laboratory.title}
                  </h2>
                  {laboratory.description && (
                    <p className={`text-base leading-relaxed ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {laboratory.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className={`text-lg font-semibold ${
                      theme === "dark" ? "text-orange-400" : "text-orange-600"
                    }`}>
                      Tarif horaire: {laboratory.hourlyRate} DT
                    </span>
                  </div>
                </div>
                {/* Image - Right */}
                <div className={`relative w-full md:w-1/2 min-h-64 md:min-h-96 overflow-hidden flex items-center justify-center ${
                  theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                }`}>
                  <img
                    src={getImageUrl(laboratory.coverImagePath || laboratory.imageUrl)}
                    alt={laboratory.title}
                    className="w-full h-full object-contain max-h-full"
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Materials Selection */}
            <AnimatedSection delay={0.1}>
              <div className={`rounded-xl p-6 shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Sélectionner les matériels
                </h2>
                
                {materials.length === 0 ? (
                  <p className={`text-center py-8 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Aucun matériel disponible
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {materials.map((material) => {
                      const isSelected = selectedMaterials.includes(material._id);
                      return (
                        <motion.div
                          key={material._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleMaterialToggle(material._id)}
                          className={`rounded-lg border-2 p-4 cursor-pointer transition-all ${
                            isSelected
                              ? theme === "dark"
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-orange-500 bg-orange-50"
                              : theme === "dark"
                              ? "border-gray-700 hover:border-gray-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className={`font-semibold text-lg ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}>
                                {material.name}
                              </h3>
                              {material.description && (
                                <p className={`text-sm mt-1 ${
                                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}>
                                  {material.description}
                                </p>
                              )}
                            </div>
                            <div className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-orange-500 bg-orange-500"
                                : theme === "dark"
                                ? "border-gray-600"
                                : "border-gray-300"
                            }`}>
                              {isSelected && (
                                <Check className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                          
                          {material.coverImagePath || material.imageUrl ? (
                            <div className={`mt-3 h-32 overflow-hidden rounded-lg flex items-center justify-center ${
                              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                            }`}>
                              <img
                                src={getImageUrl(material.coverImagePath || material.imageUrl)}
                                alt={material.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : null}
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                              material.isFree
                                ? "text-green-600"
                                : theme === "dark"
                                ? "text-orange-400"
                                : "text-orange-600"
                            }`}>
                              {material.isFree ? "Gratuit" : `${material.hourlyRate} DT/heure`}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              material.status === "available"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}>
                              {material.status === "available" ? "Disponible" : material.status}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Reservation Form */}
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className={`rounded-xl p-6 shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Informations de réservation
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Date du jour à réserver *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.reservationDate}
                      onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Heure de début *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}>
                        Heure de fin *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none`}
                      placeholder="Ajoutez des informations supplémentaires sur votre réservation..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {submitting ? "Traitement..." : "Réserver"}
                  </button>
                </div>
              </form>
            </AnimatedSection>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AnimatedSection delay={0.3}>
                <div className={`rounded-xl p-6 shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Résumé
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      Laboratoire
                    </h3>
                    <p className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {laboratory.title}
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      theme === "dark" ? "text-orange-400" : "text-orange-600"
                    }`}>
                      {laboratory.hourlyRate} DT/heure
                    </p>
                  </div>
                  
                  {selectedMaterialsData.length > 0 && (
                    <div>
                      <h3 className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        Matériels sélectionnés ({selectedMaterialsData.length})
                      </h3>
                      <div className="space-y-2">
                        {selectedMaterialsData.map((material) => (
                          <div key={material._id} className={`flex justify-between text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}>
                            <span>{material.name}</span>
                            <span className={`font-medium ${
                              material.isFree
                                ? "text-green-600"
                                : theme === "dark"
                                ? "text-orange-400"
                                : "text-orange-600"
                            }`}>
                              {material.isFree ? "Gratuit" : `${material.hourlyRate} DT/h`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.startTime && formData.endTime && hours > 0 && (
                    <div className={`pt-4 border-t ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                            Durée de réservation:
                          </span>
                          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {hours.toFixed(2)} heure{hours > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                            Laboratoire ({laboratory.hourlyRate} DT/h × {hours.toFixed(2)}h):
                          </span>
                          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {((laboratory.hourlyRate || 0) * hours).toFixed(2)} DT
                          </span>
                        </div>
                        {selectedMaterialsData.length > 0 && (
                          <div className="space-y-1">
                            {selectedMaterialsData.map((material) => {
                              if (material.isFree) return null;
                              const materialCost = (material.hourlyRate || 0) * hours;
                              return (
                                <div key={material._id} className="flex justify-between text-sm">
                                  <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                                    {material.name} ({material.hourlyRate} DT/h × {hours.toFixed(2)}h):
                                  </span>
                                  <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                                    {materialCost.toFixed(2)} DT
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-700 dark:border-gray-600">
                        <span className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                          Total
                        </span>
                        <span className={`text-xl font-bold ${
                          theme === "dark" ? "text-orange-400" : "text-orange-600"
                        }`}>
                          {totalCost.toFixed(2)} DT
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryReservation;
