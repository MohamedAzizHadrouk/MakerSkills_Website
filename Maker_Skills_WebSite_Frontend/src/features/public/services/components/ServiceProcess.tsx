import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { ArrowRight } from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ServiceProcessProps {
  steps: ProcessStep[];
  theme: 'light' | 'dark';
}

const ServiceProcess: React.FC<ServiceProcessProps> = ({ steps, theme }) => {
  return (
    <div className="relative">
      {/* Ligne de connexion entre les étapes */}
      <div className="hidden lg:block absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-orange-500 to-blue-500 opacity-20"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
        {steps.map((step, index) => (
          <AnimatedSection key={index} delay={index * 0.2}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center relative"
            >
              {/* Cercle avec numéro */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                
                {/* Indicateur de connexion pour mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Contenu */}
              <div className="px-4">
                <h3 className={`text-xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </div>
              
              {/* Indicateur de progression */}
              <div className="mt-4">
                <div className={`w-2 h-2 rounded-full mx-auto ${
                  index % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'
                }`}></div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
      
      {/* Indicateur de progression globale */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Processus éprouvé et optimisé
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceProcess; 