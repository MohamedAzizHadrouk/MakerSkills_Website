import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  DollarSign,
  Target,
  Clock,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import AnimatedSection from "../../components/UI/AnimatedSection";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/events")
      .then((res) => {
        setUpcomingEvents(res.data.data || []);
      })
      .catch(() => setUpcomingEvents([]));
  }, []);

  useEffect(() => {
    setLoadingSummary(true);
    axios
      .get(import.meta.env.VITE_API_URL + "/static/summary")
      .then((res) => {
        setSummary(res.data);
      })
      .catch(() => setSummary(null))
      .finally(() => setLoadingSummary(false));
  }, []);

  const stats = [
    {
      title: "Produits",
      value: loadingSummary ? "..." : summary?.totalProducts ?? 0,
      change: "",
      changeType: "positive",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Événements",
      value: loadingSummary ? "..." : summary?.totalEvents ?? 0,
      change: "",
      changeType: "positive",
      icon: Calendar,
      color: "bg-orange-600",
    },
    {
      title: "Commandes",
      value: loadingSummary ? "..." : summary?.totalOrders ?? 0,
      change: "",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-orange-500",
    },
    {
      title: "Participants",
      value: loadingSummary ? "..." : summary?.totalParticipants ?? 0,
      change: "",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-600",
    },
  ];

  const quickActions = [
    {
      title: "Nouveau Service",
      description: "Créer une nouveau service",
      icon: BookOpen,
      color: "bg-blue-600",
      href: "/admin/services",
    },
    {
      title: "Nouveau Blog",
      description: "Ajouter un blog",
      icon: Zap,
      color: "bg-orange-500",
      href: "/admin/blogs",
    },
    {
      title: "Ajouter Produit",
      description: "Ajouter un nouveau produit",
      icon: ShoppingBag,
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      title: "Nouvel Événement",
      description: "Créer un événement",
      icon: Calendar,
      color: "bg-orange-600",
      href: "/admin/bootcamps",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Tableau de Bord
        </h1>
        <p
          className={`mt-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Vue d'ensemble de votre plateforme éducative
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-2xl p-6 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg border border-gray-200 dark:border-gray-700`}
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
                    className={`text-2xl font-bold mt-1 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              {/*
              <div className="flex items-center mt-4">
                <ArrowUpRight
                  className={`h-4 w-4 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ml-1 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span
                  className={`text-sm ml-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  vs mois dernier
                </span>
              </div>
              */}
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className={`text-xl font-semibold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl ${action.color} text-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
                onClick={() => navigate(action.href)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(action.href); }}
              >
                <action.icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div
          className={`rounded-2xl p-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Événements à Venir
            </h2>
            <Calendar
              className={`h-5 w-5 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </div>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 4).map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } hover:bg-opacity-80 transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {event.name || event.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      event.type === "bootcamp"
                        ? "bg-orange-500 text-white"
                        : event.type === "workshop"
                        ? "bg-blue-600 text-white"
                        : event.type === "meeting"
                        ? "bg-orange-600 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {event.startDate
                          ? new Date(event.startDate).toLocaleDateString('fr-FR')
                          : 'Non précisée'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        {event.startDate
                          ? new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                          : 'Non précisée'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {event.participants?.length || event.participants || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
