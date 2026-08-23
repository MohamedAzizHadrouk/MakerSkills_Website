import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  cta: string;
  link: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  theme: string;
  currentSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides, theme, currentSlide, onPrev, onNext, onSelect }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={onPrev}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-orange-500 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-black transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange-500 w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {slides[currentSlide].type.charAt(0).toUpperCase() + slides[currentSlide].type.slice(1)}
            </motion.div>
            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.p
              className="text-lg text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {slides[currentSlide].description}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <Link
                to={slides[currentSlide].link}
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {slides[currentSlide].cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-black text-black bg-white font-semibold rounded-xl hover:bg-black hover:text-white transition-all duration-300"
              >
                En savoir plus
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 