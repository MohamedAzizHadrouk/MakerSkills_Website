import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../../../stores/useStore';
import AnimatedSection from '../../../../components/UI/AnimatedSection';

interface Achievement {
  icon: React.ComponentType<any>;
  number: string;
  label: string;
  description: string;
}

interface StatsSectionProps {
  achievements: Achievement[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ achievements }) => {
  const { theme } = useStore();

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Nos Réalisations
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Des chiffres qui témoignent de notre engagement
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`text-4xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {achievement.number}
                </motion.div>
                <div className={`text-lg font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {achievement.label}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {achievement.description}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;