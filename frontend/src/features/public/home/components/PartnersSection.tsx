import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../../../../components/UI/AnimatedSection";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../../../shared/utils/imageUtils";

interface Partner {
  _id: string;
  name: string;
  logo: string;
  website: string;
  specialite: string;
}

interface PartnersSectionProps {
  theme: string;
  partners: Partner[];
}

const getSlidesToShow = () => {
  if (window.innerWidth >= 1024) return 4; // lg+
  if (window.innerWidth >= 768) return 2; // md
  return 1; // sm
};

const PartnersSection: React.FC<PartnersSectionProps> = ({
  theme,
  partners,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  const intervalRef = useRef<number | null>(null);

  // Responsive: update slidesToShow on resize
  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play (supprimé)
  // useEffect(() => {
  //   if (partners.length <= slidesToShow) return;
  //   intervalRef.current = window.setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % partners.length);
  //   }, 3000);
  //   return () => {
  //     if (intervalRef.current) window.clearInterval(intervalRef.current);
  //   };
  // }, [partners.length, slidesToShow]);

  // Calculer les partenaires à afficher
  let visiblePartners: Partner[] = [];
  for (let i = 0; i < Math.min(slidesToShow, partners.length); i++) {
    visiblePartners.push(partners[(currentIndex + i) % partners.length]);
  }

  // Navigation manuelle
  const goPrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + partners.length) % partners.length
    );
  };
  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };

  return (
    <section className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Nos Partenaires
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Un réseau de partenaires stratégiques pour enrichir votre parcours
            </p>
          </div>
        </AnimatedSection>
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={goPrev}
            className="p-1 rounded-full bg-gray-200 hover:bg-orange-500 hover:text-white transition-colors shadow-sm"
            aria-label="Précédent"
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-8 justify-between items-stretch transition-all duration-500">
            {visiblePartners.map((partner, index) => (
              <AnimatedSection key={partner._id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl shadow-lg text-center ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } group flex flex-col justify-between h-full w-[260px] min-w-[260px] max-w-[260px]  gap-3`}
                >
                  <div className="flex flex-col gap-2 flex-grow items-center">
                    <img
                      src={getImageUrl(partner.logo)}
                      alt={partner.name}
                      className="w-16 h-16 rounded-xl object-cover mx-auto"
                    />
                    <h3
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {partner.name}
                    </h3>
                    <span className="inline-block bg-orange-500 text-white px-5 py-2 border-2 border-orange-500 rounded-full text-xs font-medium">
                      {partner.specialite}
                    </span>
                  </div>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto inline-flex items-center text-blue-900 hover:text-orange-500 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
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

export default PartnersSection;
