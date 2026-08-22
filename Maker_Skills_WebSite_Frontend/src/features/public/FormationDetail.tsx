import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Package,
  Target,
  BookOpen,
  DollarSign,
  Briefcase,
  GraduationCap,
  UserCircle,
  Rocket,
  Wrench,
  Globe,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import AnimatedSection from "../../components/UI/AnimatedSection";
import { getImageUrl } from "../../shared/utils/imageUtils";
import axios from "axios";
import { routes, getEntitySlug } from "../../shared/routes";
import { useCanonicalSlugRedirect } from "../../shared/useCanonicalSlugRedirect";
import { PageMeta } from "../../shared/PageMeta";

const FormationDetail: React.FC = () => {
  const { slug } = useParams();
  const { theme } = useStore();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useCanonicalSlugRedirect(slug, event?.slug, routes.formation);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getEventDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/events/" + slug
        );
        const { data: response } = res;
        setEvent(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error fetching the event details", error);
        setError("Erreur lors du chargement des détails de l'événement");
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      getEventDetails();
    }
  }, [slug]);

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

  if (error || !event) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <p
            className={`text-xl ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {error || "Événement non trouvé"}
          </p>
          <Link
            to="/academy"
            className="mt-4 inline-flex items-center text-orange-500 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  // Calculate original price if reduction exists
  const originalPrice = event.reduction
    ? Math.round(event.price / (1 - event.reduction / 100))
    : null;

  return (
    <div
      className={`min-h-screen pt-16 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } transition-colors duration-300`}
    >
      <PageMeta
        title={event.name}
        description={event.description}
        canonicalPath={routes.formation(getEntitySlug(event))}
      />
      {/* Header */}
      <section
        className={`py-8 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <Link
            to="/academy"
            className={`inline-flex items-center text-orange-500 hover:text-orange-600 mb-4`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux formations
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className={`py-12 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  {event.category && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.category.name}
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                </div>

                <h1
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {event.name}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
  {event.duration && (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-orange-500" />
      <span
        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {event.duration} jours
      </span>
    </div>
  )}

  {event.location && (
    <div className="flex items-center space-x-2">
      <MapPin className="h-5 w-5 text-green-500" />
      <span
        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {event.location === "online"
          ? "En ligne"
          : event.location === "in_person"
          ? "En personne"
          : "Hybride"}
      </span>
    </div>
  )}

  {event.certification && (
    <div className="flex items-center space-x-2">
      <Award className="h-5 w-5 text-purple-500" />
      <span
        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        Certificat
      </span>
    </div>
  )}

  {(event.price !== undefined && event.price !== null && event.price !== 0) || originalPrice ? (
    <div className="flex items-center space-x-2">
      <span className="inline-flex h-5 w-5 items-center justify-center text-blue-500 text-lg">
        💰
      </span>
      <span
        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {event.price ? `${event.price.toFixed(0)}DT` : "Gratuit"}
        {originalPrice && (
          <span
            className={`text-sm line-through ml-2 ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {originalPrice.toFixed(0)}DT
          </span>
        )}
      </span>
    </div>
  ) : null}
</div>

              
                {event.objectives && event.objectives.length > 0 && (
                <AnimatedSection>
                  <div className="mt-12">
                    <h2
                      className={`text-2xl font-bold mb-6 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <Target className="h-6 w-6 inline mr-2" />
                      Objectifs d'apprentissage
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.objectives.map((objective: string, index: number) => (
                        objective ?  
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {objective}
                          </span>
                        </motion.div> : null
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              </div>
              <AnimatedSection className="mt-6 w-full sm:w-auto sm:max-w-xs">
    <motion.button
      onClick={() => {
        navigate(routes.participate(getEntitySlug(event)));
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
    >
      S'inscrire maintenant
    </motion.button>
  </AnimatedSection>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden rounded-lg">
                <img
                  src={
                    event.coverImage
                      ? getImageUrl(event.coverImage)
                      : "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={event.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Enrollment Card */}
      <section
        className={`py-8 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-4">
   
        </div>
      </section>

      {/* Content Sections */}
      <section
        className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Modules/Curriculum */} 
              {event.modules && event.modules[0].title !== "" && event.modules.length > 0 && (
                <AnimatedSection>
                  <div>
                    <div className="flex flex-col items-center mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                        theme === "dark" ? "bg-orange-500/20" : "bg-orange-100"
                      }`}>
                        <BookOpen className="h-7 w-7 text-orange-500" />
                      </div>
                      <h2
                        className={`text-2xl font-bold text-center ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Programme détaillé
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {event.modules.map((module, index) => (
                        module?.title ? 
                        <motion.div
                          key={module._id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-xl ${
                            theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3
                                className={`text-lg font-semibold mb-2 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {module.title}
                              </h3>
                              {module.items && module.items.length > 0 && (
                                <ul className="space-y-1">
                                  {module.items.map((item, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center space-x-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span
                                        className={`text-sm ${
                                          theme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </motion.div> : null
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Choose Your Learning Plan */}
              <AnimatedSection>
                <div className={`rounded-2xl p-8 md:p-10 ${
                  theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex flex-col items-center mb-8">
                    <h2
                      className={`text-2xl md:text-3xl font-bold text-center ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Choisissez votre formule
                    </h2>
                    <p className={`text-center mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      Sélectionnez l'option qui vous correspond
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Pack 1: Formation en groupe */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className={`flex flex-col h-full p-6 md:p-8 rounded-2xl border-2 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 hover:border-orange-500/50 shadow-lg"
                          : "bg-white border-gray-200 hover:border-orange-300 shadow-md hover:shadow-xl"
                      } transition-all duration-300`}
                    >
                      <div className="flex-1 flex flex-col items-center text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                          En groupe
                        </span>
                        <h3
                          className={`text-lg font-bold mt-3 mb-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Apprendre Ensemble. Payer Moins
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Rejoignez la formation en groupe et bénéficiez d&apos;un tarif réduit.
                        </p>
                        <p
                          className={`text-sm mt-3 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Apprenez avec vos amis et profitez d&apos;une réduction spéciale pour les équipes.
                        </p>
                        <p
                          className={`text-sm mt-3 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Vous pouvez ajouter des amis plus tard.
                        </p>
                      </div>
                      <motion.button
                        onClick={() => navigate(routes.participate(getEntitySlug(event)))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                      >
                        S'inscrire maintenant
                      </motion.button>
                    </motion.div>

                    {/* Pack 2: Formation + Kit d'apprentissage */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className={`flex flex-col h-full p-6 md:p-8 rounded-2xl border-2 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 hover:border-orange-500/50 shadow-lg"
                          : "bg-white border-gray-200 hover:border-orange-300 shadow-md hover:shadow-xl"
                      } transition-all duration-300`}
                    >
                      <div className="flex-1 flex flex-col items-center text-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                          Kit inclus
                        </span>
                        <h3
                          className={`text-lg font-bold mt-3 mb-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Formation + Kit d&apos;apprentissage
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Achetez la formation avec votre kit et payez moins.
                        </p>
                        <p
                          className={`text-sm mt-3 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Profitez d&apos;une expérience complète avec la formation et le kit matériel pour réaliser vos projets pratiques.
                        </p>
                        <p
                          className={`text-sm mt-3 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Vous pouvez ajouter des amis plus tard.
                        </p>
                      </div>
                      <motion.button
                        onClick={() => navigate(routes.participate(getEntitySlug(event)))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                      >
                        S&apos;inscrire maintenant
                      </motion.button>
                    </motion.div>

                    {/* Pack 3: Workshop sur site */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className={`flex flex-col h-full p-6 md:p-8 rounded-2xl border-2 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 hover:border-orange-500/50 shadow-lg"
                          : "bg-white border-gray-200 hover:border-orange-300 shadow-md hover:shadow-xl"
                      } transition-all duration-300`}
                    >
                      <div className="flex-1 flex flex-col items-center text-center">
                        <span className="text-xs font-semibold text-orange-500">
                          Vous le voulez dans votre établissement ?
                        </span>
                        <h3
                          className={`text-lg font-bold mt-3 mb-4 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Organisez un Workshop pratique
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Nos experts se déplacent dans votre école, université ou entreprise avec l&apos;équipement nécessaire pour animer un atelier pratique et immersif.
                        </p>
                      </div>
                      <motion.button
                        onClick={() => navigate(routes.participate(getEntitySlug(event)))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-6 w-full py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                      >
                        Postuler maintenant
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Learning Objectives */}
          

              {/* Products */}
              {event.products && event.products.length > 0 && (
                <AnimatedSection>
                  <div>
                    <div className="flex flex-col items-center mb-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                        theme === "dark" ? "bg-orange-500/20" : "bg-orange-100"
                      }`}>
                        <Package className="h-7 w-7 text-orange-500" />
                      </div>
                      <h2
                        className={`text-2xl font-bold text-center ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Produits recommandés
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.products.map((product, index) => (
                        <a
                          key={product._id}
                          href={routes.product(getEntitySlug(product))}
                          className={`p-4 rounded-lg border ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            {product.images && product.images.length > 0 && (
                              <img
                                src={getImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <h3
                              className={`font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {product.name}
                            </h3>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Ce que vous obtiendrez avec MakerSkills */}
              <AnimatedSection>
                <div
                  className={`p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Ce que vous obtiendrez avec MakerSkills
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Kits de projets pratiques
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Obtenez tout ce qu&apos;il vous faut pour réaliser des projets concrets et mettre immédiatement en pratique ce que vous apprenez.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Parcours d&apos;apprentissage structurés
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Des programmes de formation étape par étape conçus pour vous amener du niveau débutant au niveau professionnel.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Certificat reconnu par l&apos;industrie
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Obtenez des certificats qui attestent de vos compétences pratiques et vous aident à vous démarquer auprès des employeurs.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <UserCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Mentorat d&apos;experts
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Apprenez directement auprès d&apos;ingénieurs expérimentés et bénéficiez d&apos;un accompagnement tout au long de votre parcours.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </AnimatedSection>

              {/* Ce que vous deviendrez */}
              <AnimatedSection>
                <div
                  className={`p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-bold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Ce que vous deviendrez
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <Rocket className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Créateur de projets réels
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Concevez des projets technologiques innovants qui démontrent vos véritables capacités en ingénierie.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Wrench className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Solutionneur de problèmes concrets
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Développez des compétences pratiques qui vont au-delà de la théorie et vous préparent aux défis réels de l&apos;industrie.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Portfolio technique solide
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Constituez un portfolio de projets qui met en valeur vos compétences auprès des clients et des recruteurs.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          Professionnel prêt pour le marché
                        </span>
                        <p className={`text-sm mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Acquérez la confiance et les compétences techniques nécessaires pour décrocher des missions en freelance ou des emplois dans la tech.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </AnimatedSection>

              {/* Instructor */}
              {event.instructor?.name && (
                <AnimatedSection>
                  <div
                    className={`p-6 rounded-xl ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Votre formateur
                    </h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        {event.instructor.photoUrl ? (
                          <img
                            src={event.instructor.photoUrl}
                            alt={event.instructor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {event.instructor.name}
                        </h4>
                        {event.instructor.title && (
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {event.instructor.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {event.instructor.experienceYears && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-orange-500" />
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {event.instructor.experienceYears} ans d'expérience
                          </span>
                        </div>
                      )}
                      {event.instructor.studentsCount && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {event.instructor.studentsCount} étudiants formés
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Prerequisites */}
              {event.required && event.required.length > 0 && (
                <AnimatedSection>
                  <div
                    className={`p-6 rounded-xl ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Prérequis
                    </h3>
                    <ul className="space-y-2">
                      {event.required.map((prereq, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {prereq}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              )}

              {/* What's Included */}
              {event.includedInEvent && event.includedInEvent.length > 0 && (
                <AnimatedSection>
                  <div
                    className={`p-6 rounded-xl ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Inclus dans la formation
                    </h3>
                    <ul className="space-y-2">
                      {event.includedInEvent.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FormationDetail;
