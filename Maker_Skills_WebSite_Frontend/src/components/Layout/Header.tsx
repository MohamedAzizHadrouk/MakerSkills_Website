import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { translations } from "../../data/translations";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, language, setTheme, setLanguage, isAuthenticated, logout } =
    useStore();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: t.nav.home },
    { path: "/lab40", label: t.nav.lab40 },
    { path: "/services", label: t.nav.services },
    {
      path: "/academy",
      label: "Formations",
    },
    { path: "/shop", label: t.nav.shop },
    { path: "/blogs", label: t.nav.blogs },
    { path: "/contact", label: t.nav.contact },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  const getNavbarClasses = () => {
    const baseClasses =
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b";

    if (isScrolled) {
      return `${baseClasses} ${
        theme === "dark"
          ? "bg-gray-900/95 backdrop-blur-md border-gray-700"
          : "bg-white/95 backdrop-blur-md border-gray-200"
      }`;
    }

    return `${baseClasses} bg-white/95 backdrop-blur-md border-gray-200`;
  };

  const getTextClasses = () => {
    if (isScrolled) {
      return theme === "dark" ? "text-white" : "text-gray-900";
    }
    return "text-gray-900";
  };

  const getHoverClasses = () => {
    if (isScrolled) {
      return theme === "dark"
        ? "hover:text-white hover:bg-gray-800"
        : "hover:text-gray-900 hover:bg-gray-100";
    }
    return "hover:text-gray-900 hover:bg-gray-100";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={getNavbarClasses()}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center ">
            <img
              src="/images/maker.logo.png"
              alt="Maker Skills"
              className="h-16 w-16 rounded-lg"
            />
            <span className={`text-xl font-bold ${getTextClasses()}`}>
              Maker Skills
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsAcademyOpen(true)}
                    onMouseLeave={() => setIsAcademyOpen(false)}
                  >
                    <button
                      className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                        location.pathname.startsWith("/academy")
                          ? "text-orange-500"
                          : `${getTextClasses()} ${getHoverClasses()}`
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isAcademyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg border ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              theme === "dark"
                                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? "text-orange-500"
                        : `${getTextClasses()} ${getHoverClasses()}`
                    }`}
                  >
                    {item.label}
                    {(location.pathname === item.path || location.pathname.startsWith(item.path + '/')) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            { /*<button
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors ${getTextClasses()} ${getHoverClasses()}`}
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${getTextClasses()} ${getHoverClasses()}`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Admin Link */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t.nav.admin}
                </Link>
                <button
                  onClick={logout}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${getTextClasses()} ${getHoverClasses()}`}
                >
                  {t.admin.logout}
                </button>
              </div>
            ) :  null}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${getTextClasses()} ${getHoverClasses()}`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden py-4 border-t ${
              isScrolled
                ? "border-gray-200 dark:border-gray-700"
                : "border-white/20"
            }`}
          >
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                      ? "text-orange-500"
                      : `${getTextClasses()} ${getHoverClasses()}`
                  }`}
                >
                  {item.label}
                </Link>
                {item.hasDropdown &&
                  item.dropdownItems?.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.path}
                      to={dropdownItem.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-8 py-2 text-sm transition-colors ${
                        isScrolled
                          ? theme === "dark"
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
              </div>
            ))}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
