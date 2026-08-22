import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import AnimatedSection from "../../../../components/UI/AnimatedSection";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { routes, getEntitySlug } from "../../../../shared/routes";

const CalendarSection: React.FC = () => {
  const { theme } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:3020"}/events`
        );
        const data = response.data.data || response.data;
        // S'assurer que data est toujours un tableau
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]); // S'assurer que events est un tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filters = [
    { id: "all", label: "Tous", color: "bg-gray-500" },
    { id: "course", label: "Formations", color: "bg-blue-600" },
    { id: "bootcamp", label: "Bootcamps", color: "bg-orange-500" },
    { id: "workshop", label: "Workshops", color: "bg-blue-500" },
    { id: "event", label: "Événements", color: "bg-orange-600" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-600";
      case "bootcamp":
        return "bg-orange-500";
      case "workshop":
        return "bg-blue-500";
      case "event":
        return "bg-orange-600";
      default:
        return "bg-gray-500";
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
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case "in_person":
        return "En personne";
      case "online":
        return "En ligne";
      case "hybrid":
        return "Hybride";
      default:
        return location || "Non spécifié";
    }
  };

  const filteredEvents = Array.isArray(events) ? events.filter((event) => {
    // Apply type filter
    const matchesType =
      selectedFilter === "all" || event.type === selectedFilter;

    // Require dateDebut: exclude events without a start date
    if (!event.dateDebut) {
      return false;
    }

    const eventDate = new Date(event.dateDebut);
    if (isNaN(eventDate.getTime())) {
      return false; // Exclude invalid dates
    }

    return (
      matchesType &&
      eventDate.getMonth() === currentMonth.getMonth() &&
      eventDate.getFullYear() === currentMonth.getFullYear()
    );
  }) : [];

  const hasEvents = filteredEvents.length > 0;

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    setCurrentMonth(newMonth);
  };

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    setCurrentMonth(newMonth);
  };

  return (
    <section
      className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Calendrier des Événements
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Découvrez nos prochaines formations, bootcamps et workshops
            </p>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? `${filter.color} text-white shadow-lg`
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Calendar Header */}
        <AnimatedSection>
          <div
            className={`flex items-center justify-between p-6 rounded-t-2xl ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <button
              onClick={prevMonth}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {currentMonth.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={nextMonth}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </AnimatedSection>

        {/* Events Grid */}
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${hasEvents ? 'mt-6' : ''}`}>
          {loading ? (
            <AnimatedSection>
              <div
                className={`text-center p-6 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Chargement des événements...
                </p>
              </div>
            </AnimatedSection>
          ) : error ? (
            <AnimatedSection>
              <div
                className={`text-center p-6 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <p className={`text-lg text-red-500`}>{error}</p>
              </div>
            </AnimatedSection>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <AnimatedSection key={event._id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } group cursor-pointer`}
                >
                  <div className="relative">
                    <img
                      src={
                        event.coverImage?.startsWith("http")
                          ? event.coverImage
                          : `${import.meta.env.VITE_API_URL || "http://localhost:3020"}/${
                              event.coverImage
                            }` ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={event.name || "Événement"}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                          event.type
                        )}`}
                      >
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                    {event.price === 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Gratuit
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-lg font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {event.name || "Événement sans nom"}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {event.dateDebut
                                ? new Date(event.dateDebut).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "Date non spécifiée"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {event.duration
                            ? `${event.duration} ${
                                event.duration.includes("heure")
                                  ? ""
                                  : event.duration === "1"
                                  ? "heure"
                                  : "heures"
                              }`
                            : "Durée non spécifiée"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {event.address || getLocationLabel(event.location)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {event.participants?.length || 0} participants
                        </span>
                      </div>
                    </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div
                        className={`text-xl font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {event.price === 0 || event.price === undefined  || event.price === null || event.price === "" ? "Gratuit" : `${event.price}DT`}
                      </div>

                      <motion.button
                        onClick={() => navigate(routes.formation(getEntitySlug(event)))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 ${getTypeColor(
                          event.type
                        )} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
                      >
                        S'inscrire
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))
          ) : (
            // Make the empty-state take the full width of the grid (span all columns)
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <AnimatedSection>
                <div
                  className={`mx-auto text-center p-10 rounded-2xl w-full ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <Calendar className="h-10 w-10 text-orange-500" />
                  </div>
                  <h4 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Aucun événement ce mois-ci
                  </h4>
                  <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Essayez d'ajuster le filtre ou consultez tous nos événements.
                  </p>

                  <div className="mt-6">
                    <motion.button
                      onClick={() => navigate("/academy")}
                      whileHover={{ scale: 1.03 }}
                      className="mx-auto px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:opacity-90"
                    >
                      Voir tous les événements
                    </motion.button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>

        {/* View All Button - only show when there ARE events (avoid duplicate when empty state already has the button) */}
        {filteredEvents.length > 0 && (
          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <motion.button
                onClick={() => navigate("/academy")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
              >
                Voir tous les événements
              </motion.button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default CalendarSection;
