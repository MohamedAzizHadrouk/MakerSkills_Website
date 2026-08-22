import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { Service } from '../../../admin/services/types/service';

interface ServiceVideoProps {
  service: Service;
  theme: 'light' | 'dark';
}

const ServiceVideo: React.FC<ServiceVideoProps> = ({ service, theme }) => {
  // On suppose que service.coverImagePath ou service.description contient la vidéo ou l'image
  // À adapter selon la structure réelle
  return (
    <AnimatedSection direction="right">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          {service.coverImagePath ? (
            <img
              src={service.coverImagePath}
              alt={service.name}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">
              Pas d'image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
            <p className="text-sm opacity-90 mb-4">{service.description}</p>
            {/* Afficher d'autres infos si besoin */}
          </div>
          <div className="absolute top-6 right-6">
            <motion.div
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="h-5 w-5 text-white ml-1" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default ServiceVideo; 