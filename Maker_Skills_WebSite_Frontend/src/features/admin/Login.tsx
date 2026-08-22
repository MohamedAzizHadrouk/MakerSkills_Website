import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { translations } from "../../data/translations";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme, language, login } = useStore();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication (in a real app, this would be handled by a backend)
    try {
      let response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/login",
        { email, password }
      );
      setError("");
      login(response.data);
      localStorage.setItem("token", response?.data?.access_token);
      navigate("/admin");
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center  mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/maker.logo.png"
              alt="Maker Skills"
              className="h-16 w-16 rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              Maker Skills
            </span>
          </div>
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.admin.login}
          </h2>
          <p
            className={`mt-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Accédez au tableau de bord administrateur
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t.contact.form.email}
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500"
                } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                placeholder="admin@makerskills.tn"
                required
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500"
                } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Se connecter
          </motion.button>
        </form>

        <div
          className={`mt-6 text-center text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        ></div>
      </motion.div>
    </div>
  );
};

export default Login;
