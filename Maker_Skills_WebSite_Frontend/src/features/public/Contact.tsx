import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Calendar } from 'lucide-react';
import { useStore } from '../../stores/useStore';
import { translations } from '../../data/translations';
import AnimatedSection from '../../components/UI/AnimatedSection';
import GradientBackground from '../../components/UI/GradientBackground';

const Contact: React.FC = () => {
  const { theme, language } = useStore();
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Technopole d\'el Ghazala, Ariana, Tunisie'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+216 25 801 660'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@makerskills.tn'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven: 8h00 - 18h00', 'Sam: 9h00 - 16h00'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const contactTypes = [
    { value: 'general', label: 'Demande générale', icon: MessageCircle },
    { value: 'formation', label: 'Informations formations', icon: Users },
    { value: 'partnership', label: 'Partenariat', icon: Users },
    { value: 'support', label: 'Support technique', icon: MessageCircle }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Hero Section */}
      <GradientBackground className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Contactez-nous
              </h1>
              <p className={`text-xl max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre parcours
              </p>
            </div>
          </AnimatedSection>
        </div>
      </GradientBackground>

      {/* Contact Info Cards */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`p-6 rounded-2xl shadow-lg text-center ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {detail}
                    </p>
                  ))}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection>
              <div className={`p-8 rounded-2xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                        placeholder="+216 12 345 678"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Type de demande
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                        } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      >
                        {contactTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Sujet *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Envoyer le message</span>
                  </motion.button>
                </form>
              </div>
            </AnimatedSection>

            {/* Map & Additional Info */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                {/* Map Placeholder */}
                <div className={`p-8 rounded-2xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Notre Localisation
                  </h3>
                  <div className={`w-full h-64 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } flex items-center justify-center`}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d391.04297645829513!2d10.18657616640743!3d36.89437955554207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2stn!4v1753711102693!5m2!1sfr!2stn"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>

                {/* Quick Contact */}
                <div className={`p-8 rounded-2xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-xl font-bold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Contact Rapide
                  </h3>
                  
                  <div className="space-y-4">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      href="tel:+21625801660"
                      className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <Phone className="h-5 w-5 text-orange-500" />
                      <span className={`${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Appelez-nous maintenant
                      </span>
                    </motion.a>
                    
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      href="mailto:contact@makerskills.tn"
                      className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <Mail className="h-5 w-5 text-blue-500" />
                      <span className={`${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Envoyez un email
                      </span>
                    </motion.a>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span className={`${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Planifier un rendez-vous
                      </span>
                    </motion.button>
                  </div>
                </div>
                </div>
                </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Questions Fréquentes
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: 'Comment puis-je m\'inscrire à une formation ?',
                answer: 'Vous pouvez vous inscrire directement sur notre site web ou nous contacter par téléphone.'
              },
              {
                question: 'Proposez-vous des formations en ligne ?',
                answer: 'Oui, nous proposons des formations hybrides avec des sessions en ligne et en présentiel.'
              },
              {
                question: 'Quels sont les prérequis pour les bootcamps ?',
                answer: 'Les prérequis varient selon le bootcamp. Consultez la page dédiée pour plus d\'informations.'
              },
              {
                question: 'Offrez-vous des certifications ?',
                answer: 'Oui, toutes nos formations incluent une certification reconnue par l\'industrie.'
              }
            ].map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  } shadow-lg`}
                >
                  <h3 className={`text-lg font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {faq.answer}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;