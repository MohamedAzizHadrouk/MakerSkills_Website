import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Search,
  Calendar,
  Clock,
  Users,
  Star,
  MapPin,
  Award,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import { translations } from "../../data/translations";
import AnimatedSection from "../../components/UI/AnimatedSection";
import { routes, getEntitySlug } from "../../shared/routes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Academy: React.FC = () => {
  const { theme, language } = useStore();
  const t = translations[language];
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const getCategories = async () => {
      try {
        let res = await axios.get(
          import.meta.env.VITE_API_URL + "/categories?type=event"
        );
        let { data } = res;
        setCategories(data?.data || []);
      } catch (error) {
        console.log("error fetching categories", error);
      }
    };

    const getEvents = async () => {
      try {
        let res = await axios.get(import.meta.env.VITE_API_URL + "/events");
        let { data } = res;
        setEvents(data?.data || []);
        console.log("events", data.data);
      } catch (error) {
        console.log("error fetching events", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
    getCategories();
  }, []);

  // Transform API data to match component expectations
  const transformedEvents = events.map((event) => ({
    id: event._id,
    slug: event.slug,
    type: event.type, // event, course, bootcamp
    title: event.name,
    description: event.objectives?.[0] || "No description available",
    image: event.coverImage
      ? `${import.meta.env.VITE_API_URL}/${event.coverImage}`
      : "https://images.pexels.com/photos/32894960/pexels-photo-32894960.jpeg?auto=compress&cs=tinysrgb&w=800&h=800",
    category: event.category?._id || "unknown",
    format:
      event.location === "online"
        ? "online"
        : event.location === "in_person"
        ? "onsite"
        : "hybrid",
    duration: `${event.duration} ${
      event.type === "event" ? "heures" : "semaines"
    }`,
    price: event.price - (event.price * (event.reduction ?? 0)) / 100, // Apply reduction
    originalPrice: event.price,
    reduction: event.reduction,
    rating: 4.5, // Default rating since it's not in API
    students: event.participants?.length || 0,
    instructor: event.instructor?.name || "",
    instructorTitle: event.instructor?.title || "",
    instructorExperience: event.instructor?.experienceYears || 0,
    startDate: event.startDate
      ? new Date(event.startDate).toLocaleDateString("fr-FR")
      : "À définir",
    location:
      event.address || (event.location === "online" ? "En ligne" : "Campus"),
    certification: event.certification,
    modules: event.modules || [],
    required: event.required || [],
    includedInEvent: event.includedInEvent || [],
    objectives: event.objectives || [],
    products: event.products || [],
  }));

  const typeFilters = [
    { id: "all", label: t.academy?.all || "Tous" },
    { id: "course", label: t.academy?.formations || "Formations" },
    { id: "bootcamp", label: t.academy?.bootcamps || "Bootcamps" },
    { id: "workshop", label: t.academy?.workshops || "Workshops" },
    { id: "event", label: t.academy?.events || "Événements" },
  ];

  const categoryFilters = [
    { id: "all", label: "Toutes" },
    ...categories.map((cat) => ({ id: cat._id, label: cat.name })),
  ];

  const formatFilters = [
    { id: "all", label: "Tous" },
    { id: "online", label: t.academy?.online || "En ligne" },
    { id: "onsite", label: t.academy?.onsite || "Présentiel" },
    { id: "hybrid", label: "Hybride" },
  ];

  const filteredItems = transformedEvents.filter((item) => {
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "all" || item.format === selectedFormat;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesFormat && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-primary-900 text-white";
      case "bootcamp":
        return "bg-secondary-500 text-white";
      case "workshop":
        return "bg-blue-600 text-white";
      case "event":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course":
        return "Formation";
      case "bootcamp":
        return "Bootcamp";
      case "workshop":
        return "Workshop";
      case "event":
        return "Événement";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen pt-16 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } transition-colors duration-300`}
    >
      {/* Hero Section */}
      

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div
              className={`p-6 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-50"
              } sticky top-24`}
            >
              <h3
                className={`text-lg font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Filtres
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rechercher
                </label>
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
                  />
                </div>
              </div>

          
              {/* Category Filter */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Catégorie
                </label>
                <div className="space-y-2">
                  {categoryFilters.map((filter) => (
                    <label key={filter.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={filter.id}
                        checked={selectedCategory === filter.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-secondary-500 border-gray-300 focus:ring-secondary-500"
                      />
                      <span
                        className={`ml-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Format Filter */}
              <div>
                <label
                  className={`block text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Format
                </label>
                <div className="space-y-2">
                  {formatFilters.map((filter) => (
                    <label key={filter.id} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={filter.id}
                        checked={selectedFormat === filter.id}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-4 h-4 text-secondary-500 border-gray-300 focus:ring-secondary-500"
                      />
                      <span
                        className={`ml-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {filter.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Top Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              {typeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedType(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === filter.id
                      ? "bg-secondary-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.1}>
                  <motion.div
                     onClick={() => {
                      navigate(routes.formation(getEntitySlug(item)));
                    }}

                    
                    whileHover={{ y: -5,cursor: "pointer"  }}
                    className={`rounded-xl shadow-lg overflow-hidden ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    } group`}
                  >
                    <div className="relative">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.pexels.com/photos/32894960/pexels-photo-32894960.jpeg?auto=compress&cs=tinysrgb&w=800&h=800";
                          }}
                        />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                  
                      {item.reduction > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          -{item.reduction}%
                        </div>
                      )}
                      {item.certification && (
                        <div className="absolute bottom-4 right-4 bg-purple-500 text-white p-2 rounded-full">
                          <Award className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3
                        className={`text-lg font-bold mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-sm mb-4 line-clamp-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                   

                      

                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {item.rating}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-green-500" />
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {item.startDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {item.instructor}
                          </div>
                          <div
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {item.instructorTitle}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-purple-500" />
                            <span
                              className={`text-xs ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xl font-bold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.price === 0 || item.price === null || item.price === undefined
                              ? ""
                              : item.price ? `${item.price.toFixed(0)}DT` : "" }
                          </div>
                          {item.reduction > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              {item.originalPrice}DT
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate(routes.formation(getEntitySlug(item)));
                        }}
                        className="w-full py-2 bg-secondary-500 text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                      >
                        En savoir plus
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div
                  className={`text-6xl mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  🔍
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Aucun résultat trouvé
                </h3>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Essayez de modifier vos critères de recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academy;
