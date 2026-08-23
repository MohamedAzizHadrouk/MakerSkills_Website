import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';

interface AboutValue {
  icon: React.ElementType;
  title: string;
  description: string;
  stats: string;
}


interface WhyChooseUsReason {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface AboutSectionProps {
  theme: string;
  aboutValues: AboutValue[];
  whyChooseUs: WhyChooseUsReason[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ theme, aboutValues, whyChooseUs }) => (
  <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
    <div className="container mx-auto px-4">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>À Propos de Maker Skills</h2>
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>École d'innovation qui aide à apprendre les nouvelles technologies et à améliorer l'invention. Nous croyons que l'avenir de l'apprentissage évolue et que les voies d'apprentissage alternatives seront importantes pour personnaliser les parcours d'apprentissage des gens.</p>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>
      </AnimatedSection>
      {/* Mission, Vision, Values */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16 items-stretch">
        {aboutValues.map((value, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -10 }}
              className={`p-8 rounded-2xl shadow-lg relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} flex flex-col h-full`}
            >
              <div className={`w-16 h-16 rounded-xl ${index % 2 === 0 ? 'bg-orange-500' : 'bg-blue-900'} flex items-center justify-center mb-6`}>
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value.title}</h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{value.description}</p>
              <div className={`text-sm font-semibold ${index % 2 === 0 ? 'text-orange-500' : 'text-blue-900'} mt-auto`}>{value.stats}</div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
      {/* Team Section */}
      {/* <AnimatedSection>
        <div className="text-center mb-12">
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notre Équipe d'Experts</h3>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Des professionnels passionnés et expérimentés pour vous accompagner</p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {team.map((member, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-bold">{member.name}</h4>
                  <p className="text-sm opacity-90">{member.role}</p>
                </div>
              </div>
              <div className="p-6">
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{member.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-orange-500" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{member.experience}</span>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div> */}
      {/* Why Choose Us */}
      <AnimatedSection>
        <div className="text-center mb-12">
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Pourquoi Choisir Maker Skills ?</h3>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyChooseUs.map((reason, index) => (
          <AnimatedSection key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-start space-x-4">
                <reason.icon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{reason.title}</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{reason.description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection; 