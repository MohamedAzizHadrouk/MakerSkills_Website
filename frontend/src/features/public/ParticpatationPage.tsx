import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Award,
  Package,
  Target,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import { routes, getEntitySlug } from "../../shared/routes";
import { useCanonicalSlugRedirect } from "../../shared/useCanonicalSlugRedirect";
import { PageMeta } from "../../shared/PageMeta";

// Mock store hook for theme
const useStore = () => ({ theme: "light" });

const ParticipationPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Form state
  const [participationType, setParticipationType] = useState("individual");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organizationName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Mock event data (replace with API call if needed)

  const [event, setEvent] = useState<any>({
    name: "Formation Avancée en Développement Web",
    price: 450,
    duration: 5,
    location: "online",
    startDate: "2024-02-15",
    certification: true,
    category: { name: "Développement Web" },
    type: "Formation",
    instructor: {
      name: "Ahmed Ben Salem",
      title: "Expert en Développement Web",
    },
  });
  useCanonicalSlugRedirect(slug, event?.slug, routes.participate);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          (import.meta.env.VITE_API_URL ?? "http://localhost:3020") + "/events/" + slug
        );
        const { data: response } = res;
        setEvent(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error fetching the event details", error);
       
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      getEventDetails();
    }
  }, [slug]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";

    if (
      participationType === "organization" &&
      !formData.organizationName.trim()
    ) {
      newErrors.organizationName = "Nom de l'organisation requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const submitData = {
        ...formData,
        eventId: event._id,
        ...(participationType === "individual"
          ? {}
          : { organizationName: formData.organizationName }),
      };
      if(submitData.dateOfBirth === "") submitData.dateOfBirth = null;
      axios
        .post((import.meta.env.VITE_API_URL ?? "http://localhost:3020") + "/participants", submitData)
        .then((res) => {
          setSubmitted(true);
        })
        .catch((err) => {
          console.log("error", err)
          setError(err.response.data.message);
        });
    } catch (error) {
      console.error("Submission error:", error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim()
      ) {
        validateForm();
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p
            className={`mt-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1
              className={`text-3xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Inscription confirmée !
            </h1>
            <p
              className={`text-lg mb-8 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Votre inscription à la formation "{event.name}" a été enregistrée
              avec succès.
            </p>
            <div
              className={`p-6 rounded-xl mb-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Prochaines étapes
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Vous recevrez un email de confirmation dans les prochaines
                    minutes
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Les détails de connexion vous seront envoyés 24h avant le
                    début
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    Préparez-vous pour une expérience d'apprentissage
                    exceptionnelle !
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/academy")}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retour aux formations
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <PageMeta
        title={`Inscription - ${event.name}`}
        description={event.description}
        canonicalPath={routes.participate(getEntitySlug(event))}
      />
      {/* Header */}
      <section
        className={`w-full py-8 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(routes.formation(getEntitySlug(event)))}
            className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la formation
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Inscription à la formation
              </h1>
              <p
                className={`mt-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {event.name}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center space-x-1 sm:space-x-2 mt-4 sm:mt-0">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-6 sm:w-8 h-1 ml-1 sm:ml-2 ${
                        step < currentStep ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Type de participation */}
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2
                            className={`text-xl font-bold mb-4 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Type de participation
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setParticipationType("individual")}
                              className={`p-6 rounded-xl border-2 transition-all ${
                                participationType === "individual"
                                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                  : theme === "dark"
                                  ? "border-gray-700 bg-gray-700"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <User className="h-8 w-8 text-orange-500 mb-3" />
                              <h3
                                className={`font-semibold mb-2 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                Particulier
                              </h3>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                Inscription individuelle pour développer vos
                                compétences
                              </p>
                            </motion.button>

                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setParticipationType("organization")
                              }
                              className={`p-6 rounded-xl border-2 transition-all ${
                                participationType === "organization"
                                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                  : theme === "dark"
                                  ? "border-gray-700 bg-gray-700"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <Building className="h-8 w-8 text-orange-500 mb-3" />
                              <h3
                                className={`font-semibold mb-2 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                Organisation
                              </h3>
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                Formation pour votre équipe ou employés
                              </p>
                            </motion.button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Prénom *
                            </label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.firstName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-white"
                              }`}
                              placeholder="Votre prénom"
                            />
                            {errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.firstName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Nom *
                            </label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) =>
                                handleInputChange("lastName", e.target.value)
                              }
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.lastName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-white"
                              }`}
                              placeholder="Votre nom"
                            />
                            {errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.lastName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Email *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                errors.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-white"
                              }`}
                              placeholder="votre@email.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {participationType === "organization" && (
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Nom de l'organisation *
                            </label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={formData.organizationName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "organizationName",
                                    e.target.value
                                  )
                                }
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                  errors.organizationName
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } ${
                                  theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-white"
                                }`}
                                placeholder="Nom de votre organisation"
                              />
                            </div>
                            {errors.organizationName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.organizationName}
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 2: Informations complémentaires */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2
                          className={`text-xl font-bold mb-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Informations complémentaires
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Téléphone
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300 ${
                                  theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-white"
                                }`}
                                placeholder="+216 XX XXX XXX"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Date de naissance
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) =>
                                  handleInputChange(
                                    "dateOfBirth",
                                    e.target.value
                                  )
                                }
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300 ${
                                  theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-white"
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Adresse
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <textarea
                              value={formData.address}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              rows={3}
                              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300 ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-white"
                              }`}
                              placeholder="Votre adresse complète"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Ville
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300 ${
                                theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-white"
                              }`}
                              placeholder="Tunis"
                            />
                          </div>

                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Pays
                            </label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <select
                                value={formData.country}
                                onChange={(e) =>
                                  handleInputChange("country", e.target.value)
                                }
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent border-gray-300 ${
                                  theme === "dark"
                                    ? "bg-gray-700 text-white"
                                    : "bg-white"
                                }`}
                              >
                                <option value="">Sélectionnez un pays</option>
                                <option value="TN">Tunisie</option>
                                <option value="FR">France</option>
                                <option value="MA">Maroc</option>
                                <option value="DZ">Algérie</option>
                                <option value="other">Autre</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                            {error && (
                              <div className="bg-red-100 border border-red-500 rounded-lg p-4 mt-4">
                                <p className="text-red-500 text-sm">
                                  {error}
                                </p>
                              </div>
                            )}
                        <h2
                          className={`text-xl font-bold mb-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Confirmation de votre inscription
                        </h2> 
                        <div
                          className={`p-6 rounded-xl ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <h3
                            className={`font-semibold mb-4 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Récapitulatif
                          </h3>
                      
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }
                              >
                                Nom complet:
                              </span>
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                {formData.firstName} {formData.lastName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }
                              >
                                Email:
                              </span>
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                {formData.email}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }
                              >
                                Type:
                              </span>
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                {participationType === "individual"
                                  ? "Particulier"
                                  : "Organisation"}
                              </span>
                            </div>
                            {participationType === "organization" &&
                              formData.organizationName && (
                                <div className="flex justify-between">
                                  <span
                                    className={
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }
                                  >
                                    Organisation:
                                  </span>
                                  <span
                                    className={
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }
                                  >
                                    {formData.organizationName}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-lg border-l-4 border-orange-500 ${
                            theme === "dark"
                              ? "bg-orange-900/20"
                              : "bg-orange-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-orange-500 mr-3" />
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-orange-200"
                                  : "text-orange-800"
                              }`}
                            >
                              En vous inscrivant, vous acceptez nos conditions
                              générales et notre politique de confidentialité.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                          theme === "dark"
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Précédent
                      </button>
                    )}

                    <div className="ml-auto">
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Inscription en cours...</span>
                            </>
                          ) : (
                            <span>Confirmer l'inscription</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Formation Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <h3
                  className={`text-lg font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Résumé de la formation
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.name}
                    </span>
                  </div>
                  {event.duration && <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.duration} jours
                    </span>
                  </div>}
                      {event.startDate &&     <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Débute le{" "}
                      {new Date(event.startDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.location.charAt(0).toUpperCase() +
                        event.location.slice(1)}
                    </span>
                  </div>
                 {event.category && event.category.name &&  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.category.name}
                    </span>
                  </div>}
                 {event?.instructor?.name &&  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Instructeur: {event?.instructor?.name} (
                      {event?.instructor?.title})
                    </span>
                  </div>}
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.certification
                        ? "Certification incluse"
                        : "Aucune certification"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Prix: {event.price} TND
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationPage;
