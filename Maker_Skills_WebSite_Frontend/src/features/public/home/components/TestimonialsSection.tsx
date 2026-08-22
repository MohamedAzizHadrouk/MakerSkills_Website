import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import AnimatedSection from "../../../../components/UI/AnimatedSection";
import { Review } from "../../../admin/reviews/review";
import { getImageUrl } from "../../../../shared/utils/imageUtils";

interface TestimonialsSectionProps {
  reviews: Review[];
}

const getSlidesToShow = () => {
  if (window.innerWidth >= 1024) return 3; // lg+
  if (window.innerWidth >= 768) return 2; // md
  return 1; // sm
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  reviews,
}) => {
  const { theme } = useStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(getSlidesToShow());

  React.useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculer les reviews à afficher
  let visibleReviews: Review[] = [];
  for (let i = 0; i < Math.min(slidesToShow, reviews.length); i++) {
    visibleReviews.push(reviews[(currentIndex + i) % reviews.length]);
  }

  // Navigation manuelle
  const goPrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + reviews.length) % reviews.length
    );
  };
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section
      className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Ce que disent nos étudiants
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Découvrez les témoignages de nos anciens étudiants
            </p>
          </div>
        </AnimatedSection>
        <div className="flex items-center  ">
          <button
            onClick={goPrev}
            className="p-1 rounded-full bg-gray-200 hover:bg-orange-500 hover:text-white transition-colors shadow-sm"
            aria-label="Précédent"
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-8  items-stretch transition-all duration-500 w-full">
            {visibleReviews.map((review, index) => (
              <AnimatedSection key={review._id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`p-8 rounded-2xl shadow-lg ${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                  } relative flex flex-col justify-between h-full w-full sm:w-[320px] min-w-[260px] max-w-[340px] min-h-[340px] max-h-[380px]`}
                >
                  <div className="absolute top-4 right-4">
                    <Quote className="h-8 w-8 text-orange-500 opacity-50" />
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p
                    className={`text-lg mb-6 flex-grow ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    "{review.message}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <img
                      src={getImageUrl(review.image)}
                      alt={review.fullName}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {review.fullName}
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {review.posteActuelle || ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          <button
            onClick={goNext}
            className="p-1 rounded-full bg-gray-200 hover:bg-orange-500 hover:text-white transition-colors shadow-sm"
            aria-label="Suivant"
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
