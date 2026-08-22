import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../../stores/useStore";
import AnimatedSection from "../../../../components/UI/AnimatedSection";
import { routes } from "../../../../shared/routes";

const FeaturedCoursesCarousel: React.FC = () => {
  const { theme, language } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredCourses = [
    {
      id: "1",
      slug: "iot-pour-debutants",
      title: "IoT pour Débutants",
      description:
        "Apprenez les bases de l'Internet des Objets avec des projets pratiques",
      image:
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      video:
        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
      category: "IoT",
      duration: "8 semaines",
      students: 156,
      rating: 4.8,
      price: 299,
      level: "Débutant",
      instructor: "Dr. Ahmed Ben Ali",
    },
    {
      id: "2",
      slug: "robotique-avancee",
      title: "Robotique Avancée",
      description: "Construisez des robots intelligents avec ROS et Python",
      image:
        "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800",
      video:
        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
      category: "Robotique",
      duration: "12 semaines",
      students: 89,
      rating: 4.9,
      price: 599,
      level: "Avancé",
      instructor: "Mohamed Slim",
    },
    {
      id: "3",
      slug: "intelligence-artificielle",
      title: "Intelligence Artificielle",
      description: "Maîtrisez le Machine Learning et le Deep Learning",
      image:
        "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
      video:
        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
      category: "IA",
      duration: "16 semaines",
      students: 234,
      rating: 4.7,
      price: 899,
      level: "Intermédiaire",
      instructor: "Fatima Zahra",
    },
    {
      id: "4",
      title: "STEAM pour Enfants",
      description: "Éveillez la créativité technologique des plus jeunes",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      video:
        "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
      category: "STEAM",
      duration: "6 semaines",
      students: 312,
      rating: 4.9,
      price: 199,
      level: "Enfants",
      instructor: "Sarah Mansouri",
    },
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, featuredCourses.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "débutant":
      case "enfants":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermédiaire":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "avancé":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
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
              Formations Populaires
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Découvrez nos formations les plus demandées
            </p>
          </div>
        </AnimatedSection>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                } rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={featuredCourses[currentSlide].image}
                      alt={featuredCourses[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                          featuredCourses[currentSlide].level
                        )}`}
                      >
                        {featuredCourses[currentSlide].level}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredCourses[currentSlide].category}
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3
                      className={`text-2xl lg:text-3xl font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {featuredCourses[currentSlide].title}
                    </h3>

                    <p
                      className={`text-lg mb-6 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {featuredCourses[currentSlide].description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {featuredCourses[currentSlide].duration}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {featuredCourses[currentSlide].students} étudiants
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {featuredCourses[currentSlide].rating}/5
                        </span>
                      </div>

                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Par {featuredCourses[currentSlide].instructor}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div
                        className={`text-3xl font-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {featuredCourses[currentSlide].price}DT
                      </div>

                      <Link
                        to={routes.formation(featuredCourses[currentSlide].slug || featuredCourses[currentSlide].id)}
                        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            } shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
            } shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredCourses.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-orange-500 w-8"
                    : theme === "dark"
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesCarousel;
