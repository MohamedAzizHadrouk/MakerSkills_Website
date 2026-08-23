import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  theme: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({ theme }) => (
  <section className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-900'}`}>
    <div className="container mx-auto px-4 text-center relative z-10">
      <AnimatedSection>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Prêt à transformer votre avenir ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Rejoignez notre communauté d'innovateurs et donnez vie à vos idées les plus audacieuses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:shadow-lg transform transition-all duration-300"
              >
                Contactez-nous
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/academy"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Voir les formations
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  </section>
);

export default CtaSection;
