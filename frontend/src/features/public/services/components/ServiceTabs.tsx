import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { Service } from '../../../admin/services/types/service';
import { getImageUrl } from '../../../../shared/utils/imageUtils';

interface ServiceTabsProps {
  services: Service[];
  activeIndex: number;
  onSelect: (index: number) => void;
  theme: 'light' | 'dark';
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ services, activeIndex, onSelect, theme }) => {
  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <AnimatedSection key={service._id || index} delay={index * 0.1}>
          <motion.div
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
              activeIndex === index
                ? theme === 'dark' 
                  ? 'bg-gray-900 border-orange-500 shadow-xl' 
                  : 'bg-white border-orange-500 shadow-xl'
                : theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
            }`}
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-6">
              {/* Image du service */}
              <div className="flex-shrink-0">
                {service.coverImagePath ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden">
                    <img
                      src={getImageUrl(service.coverImagePath)}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                    activeIndex === index ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              
              {/* Contenu du service */}
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.name}
                </h3>
                
                
                {/* Statistiques du service */}
                <div className="flex items-center space-x-4 mt-3">
                  {service.projects && service.projects.length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {service.projects.length} projet{service.projects.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {service.products && service.products.length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {service.products.length} produit{service.products.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {service.events && service.events.length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {service.events.length} événement{service.events.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Indicateur de statut et flèche */}
              <div className="flex flex-col items-end space-y-2">
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                  service.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.isActive ? 'Actif' : 'Inactif'}
                </div>
                <ArrowRight className={`h-5 w-5 transition-transform ${
                  activeIndex === index 
                    ? 'text-orange-500 transform translate-x-1' 
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default ServiceTabs; 