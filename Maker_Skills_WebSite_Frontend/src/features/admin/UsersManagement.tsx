import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MapPin,
  Calendar,
  X,
  BookOpen,
  Users,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import AnimatedSection from "../../components/UI/AnimatedSection";

const UsersManagement: React.FC = () => {
  const { theme } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  // Fetch events and participants from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/participants",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        const result = await response.json();
        if (response.ok) {
          setEvents(result.data || []);
        } else {
          throw new Error(result.message || "Failed to fetch events");
        }
      } catch (err: any) {
        setError(err?.message || 'Erreur lors du chargement des données');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = (events || []).filter((event) => {
    if (!event || !event.participants) return false;
    const eventName = event.eventName || event.event?.name || '';
    const matchesSearch =
      eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(event.participants) && event.participants.some(
        (participant: any) =>
          participant &&
          (`${participant.firstName || ''} ${participant.lastName || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (participant.email && participant.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (participant.organizationName &&
            participant.organizationName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())))
      ));
    return matchesSearch;
  });

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle row click to show details
  const handleRowClick = (event, participant) => {
    setSelectedDetails({ event, participant });
  };

  // Close modal
  const closeModal = () => {
    setSelectedDetails(null);
  };

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
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Gestion des Utilisateurs
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gérez les événements et participants
              </p>
            </div>
          </div>
        </AnimatedSection>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Total Événements",
              value: events.length,
              color: "bg-blue-500",
            },
            {
              title: "Participants",
                value: (events || []).reduce(
                (sum, event) => sum + (event?.participants?.length || 0),
                0
              ),
              color: "bg-green-500",
            },
          ].map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Filters for Events */}
        <AnimatedSection>
          <div
            className={`p-6 rounded-xl mb-8 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Rechercher un événement ou participant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Events and Participants Table */}
        {loading ? (
          <AnimatedSection>
            <div className="text-center py-12">
              <p
                className={`text-xl ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Chargement...
              </p>
            </div>
          </AnimatedSection>
        ) : error ? (
          <AnimatedSection>
            <div className="text-center py-12">
              <p className={`text-xl text-red-600 dark:text-red-400`}>
                Erreur : {error}
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <>
            {/* Section Title for Events */}
            <AnimatedSection>
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Événements et Participants
              </h2>
            </AnimatedSection>

            <AnimatedSection>
              <div
                className={`rounded-xl shadow-lg overflow-hidden mb-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead
                      className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <tr>
                        <th
                          className={`px-6 py-4 text-left text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Événement
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Participant
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Contact
                        </th>
                        <th
                          className={`px-6 py-4 text-left text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Détails
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredEvents.map((event: any, index: number) =>
                        (event?.participants || []).map((participant: any, pIndex: number) => (
                          <motion.tr
                            key={`${event?.eventId || event?._id || index}-${participant?._id || pIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay:
                                (index * (event?.participants?.length || 0) + pIndex) *
                                0.1,
                            }}
                            className={`${
                              theme === "dark"
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                            } transition-colors cursor-pointer`}
                            onClick={() => handleRowClick(event, participant)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={
                                    (event?.event?.coverImage 
                                      ? import.meta.env.VITE_API_URL + "/" + event.event.coverImage
                                      : "https://via.placeholder.com/40")
                                  }
                                  alt={event?.eventName || event?.event?.name || 'Event'}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <div
                                    className={`font-medium ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {event?.eventName || event?.event?.name || 'N/A'}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    Début: {event?.event?.startDate ? formatDate(event.event.startDate) : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {participant?.firstName || ''} {participant?.lastName || ''}
                              </div>
                              <div
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                Inscrit le {participant?.createdAt ? formatDate(participant.createdAt) : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span
                                    className={`text-sm ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {participant?.email || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Type: {event?.event?.type || 'N/A'}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  <span
                                    className={`text-sm ${
                                      theme === "dark"
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {event?.event?.address || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>
          </>
        )}

        {/* Modal for Detailed Information */}
        {selectedDetails?.event != null && selectedDetails?.participant != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative w-full max-w-4xl p-8 rounded-xl shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } max-h-[85vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Détails de l'Événement et du Participant
              </h2>
              {(() => {
                const evt = selectedDetails.event?.event;
                const participant = selectedDetails.participant;
                return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                    Événement
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Nom:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedDetails.event?.eventName ?? evt?.name ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Type:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.type ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Date de début:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.startDate ? formatDate(evt.startDate) : evt?.dateDebut ? formatDate(evt.dateDebut) : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Durée:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.duration ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Prix:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.price != null ? `${evt.price} (Réduction: ${evt.reduction ?? 0}%)` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Lieu:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.address != null ? `${evt.address}${evt.location != null ? ` (${evt.location})` : ""}` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Certification:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt?.certification ? "Oui" : "Non"}
                      </span>
                    </div>
                    {evt?.instructor != null && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Formateur:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {evt.instructor.name ?? "N/A"} (
                        {evt.instructor.title ?? ""},{" "}
                        {evt.instructor.experienceYears ?? 0}{" "}
                        ans d'expérience)
                      </span>
                    </div>
                    )}
                    {(evt?.modules?.length ?? 0) > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Modules:</span>
                      <ul
                        className={`list-disc pl-5 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {(evt.modules || []).map((module: any, idx: number) => (
                          <li key={module?._id ?? idx}>
                            <BookOpen className="h-4 w-4 inline-block mr-2 text-orange-500" />
                            {module?.title ?? ""}: {(module?.items ?? []).join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}
                    {(evt?.required?.length ?? 0) > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Prérequis:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {(evt.required || []).join(", ")}
                      </span>
                    </div>
                    )}
                    {(evt?.includedInEvent?.length ?? 0) > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Inclus:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {(evt.includedInEvent || []).join(", ")}
                      </span>
                    </div>
                    )}
                    {(evt?.objectives?.length ?? 0) > 0 && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Objectifs:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {(evt.objectives || []).join(", ")}
                      </span>
                    </div>
                    )}
                    {(evt?.createdAt != null) && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Créé le:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatDate(evt.createdAt)}
                      </span>
                    </div>
                    )}
                    {(evt?.updatedAt != null) && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Mis à jour le:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatDate(evt.updatedAt)}
                      </span>
                    </div>
                    )}
                  </div>
                </div>

                {/* Participant Details */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3
                    className={`text-lg font-semibold mb-4 flex items-center ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <Users className="h-5 w-5 mr-2 text-orange-500" />
                    Participant
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Nom:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {participant?.firstName ?? ""} {participant?.lastName ?? ""}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">Email:</span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {participant?.email ?? "N/A"}
                      </span>
                    </div>
                    {participant?.organizationName && (
                      <div className="flex items-start">
                        <span className="font-medium w-32 text-sm">
                          Organisation:
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {participant.organizationName}
                        </span>
                      </div>
                    )}
                    {participant?.phone && (
                      <div className="flex items-start">
                        <span className="font-medium w-32 text-sm">
                          Téléphone:
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {participant.phone}
                        </span>
                      </div>
                    )}
                    {(participant?.createdAt != null) && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Inscrit le:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatDate(participant.createdAt)}
                      </span>
                    </div>
                    )}
                    {(participant?.updatedAt != null) && (
                    <div className="flex items-start">
                      <span className="font-medium w-32 text-sm">
                        Mis à jour le:
                      </span>
                      <span
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {formatDate(participant.updatedAt)}
                      </span>
                    </div>
                    )}
                  </div>
                </div>
              </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}

        {filteredEvents.length === 0 && !loading && !error && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div
                className={`text-6xl mb-4 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                📅
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Aucun événement ou participant trouvé
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Essayez de modifier vos critères de recherche ou ajoutez un
                nouvel événement.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
