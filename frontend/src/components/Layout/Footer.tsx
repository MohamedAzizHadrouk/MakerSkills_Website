import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import { translations } from "../../data/translations";

const Footer: React.FC = () => {
  const { theme, language } = useStore();
  const t = translations[language];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center ">
              <img
                src="/images/maker.logo.png"
                alt="Maker Skills"
                className="h-16 w-16 rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                Maker Skills
              </span>
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              École d'innovation qui aide à apprendre les nouvelles technologies
              et à améliorer l'invention.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { path: "/about", label: t.nav.about },
                { path: "/services", label: t.nav.services },
                { path: "/academy", label: t.nav.formations },
                { path: "/academy", label: t.nav.bootcamp },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Formations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Formations</h3>
            <ul className="space-y-2">
              {[
                "IoT & Objets Connectés",
                "Robotique",
                "Intelligence Artificielle",
                "Programmation",
                "STEAM pour Enfants",
              ].map((formation) => (
                <li key={formation}>
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formation}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">{t.contact.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Adresse Technopole d'El Ghazala, Ariana, Tunisie
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  +216 25 801 660
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  contact@makerskills.tn
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className={`mt-8 pt-8 border-t ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          } text-center`}
        >
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © 2024 Maker Skills. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
