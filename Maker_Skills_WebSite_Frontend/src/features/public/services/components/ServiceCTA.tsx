import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';

interface ServiceCTAProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({ title, description, buttonText, onClick }) => {
  return (
    <AnimatedSection>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Boutons d'action */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={onClick}
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
          
          <div className="flex gap-4">
            <motion.a
              href="tel:+21625801660"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="mailto:contact@makerskills.com"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
            </motion.a>
            
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-flex items-center space-x-6 text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Réponse sous 24h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Devis gratuit</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Accompagnement personnalisé</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
};

export default ServiceCTA; 