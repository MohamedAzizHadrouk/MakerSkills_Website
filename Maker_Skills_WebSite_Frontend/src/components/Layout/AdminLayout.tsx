import React from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Rss,
  Image,
  Folder,
  ShoppingCart,
  FlaskConical,
} from "lucide-react";
import { useStore } from "../../stores/useStore";

const AdminLayout: React.FC = () => {
  const { theme, logout, user } = useStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Navigation items
  const navigationItems = [
    {
      name: "Tableau de bord",
      icon: LayoutDashboard,
      path: "/admin",
      description: "Vue d'ensemble de votre plateforme",
    },

    {
      name: "Événements",
      icon: BookOpen,
      path: "/admin/bootcamps",
      description: "Gérer les événements",
    },
    {
      name: "Services",
      icon: Settings,
      path: "/admin/services",
      description: "Gérer les services proposés",
    },
    {
      name: "Laboratoire",
      icon: FlaskConical,
      path: "/admin/laboratories",
      description: "Gérer les laboratoires et matériels",
    },
    {
      name: "Partenaires",
      icon: Users,
      path: "/admin/partners",
      description: "Gérer les partenaires",
    },
    {
      name: "Produits",
      icon: Settings,
      path: "/admin/products",
      description: "Gérer la boutique",
    },
    {
      name: "Blogs",
      icon: Rss,
      path: "/admin/blogs",
      description: "Gérer les blogs",
    },
    {
      name: "Section Hero",
      icon: Image,
      path: "/admin/hero",
      description: "Gérer les banner",
    },
    {
      name: "Reviews",
      icon: Image,
      path: "/admin/reviews",
      description: "Gérer les reviews",
    },
    {
      name: "Projets",
      icon: Folder,
      path: "/admin/projects",
      description: "Gérer les projets",
    },
    {
      name: "Catégories",
      icon: Settings,
      path: "/admin/categories",
      description: "Gérer les catégories",
    },
    {
      name: "Utilisateurs",
      icon: Users,
      path: "/admin/users",
      description: "Gérer les utilisateurs",
    },
    ,
    {
      name: "Commandes",
      icon: ShoppingCart,
      path: "/admin/orders",
      description: "Gérer les commandes",
    },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
  };

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex flex-col h-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-xl`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MS</span>
              </div>
              <span
                className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Maker Skills
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div
                  key={item.path}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg"
                        : theme === "dark"
                        ? "text-gray-300 hover:text-white hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User section */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div
          className={`sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
           {/*  <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className={`pl-10 pr-4 py-2 w-64 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
              </div>
            </div> */}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {/* <button
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Bell className="h-5 w-5" />
            </button> */}

            {/* Theme toggle */}
            <button
              onClick={() =>
                useStore
                  .getState()
                  .setTheme(theme === "dark" ? "light" : "dark")
              }
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
