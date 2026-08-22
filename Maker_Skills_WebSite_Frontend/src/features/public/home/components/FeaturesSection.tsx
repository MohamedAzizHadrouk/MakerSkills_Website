import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';

interface Feature {
  title: string;
  description: string;
  image: string;
  color: string;
  icon: React.ElementType;
}

interface FeaturesSectionProps {
  theme: string;
  features: Feature[];
  t: any;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ theme, features, t }) => (
  <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
    <div className="container mx-auto px-4">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t.home.features.title}
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 p-8">
                <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
