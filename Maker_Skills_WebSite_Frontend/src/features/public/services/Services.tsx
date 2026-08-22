import React, { useState, useEffect } from 'react';
import { useStore } from '../../../stores/useStore';
import ServiceTabs from './components/ServiceTabs';
import ServiceProjects from './components/ServiceProjects';
import ServiceProcess from './components/ServiceProcess';
import ServiceCTA from './components/ServiceCTA';
import { Service } from '../../admin/services/types/service';
import ServiceService from '../../admin/services/services/service.service';
import { getImageUrl } from '../../../shared/utils/imageUtils';

const processSteps = [
  {
    step: '01',
    title: 'Analyse',
    description: 'Étude approfondie de vos besoins et contraintes'
  },
  {
    step: '02',
    title: 'Conception',
    description: 'Élaboration de la solution technique optimale'
  },
  {
    step: '03',
    title: 'Développement',
    description: 'Réalisation et tests de la solution'
  },
  {
    step: '04',
    title: 'Déploiement',
    description: 'Mise en production et formation de vos équipes'
  }
];

const Services: React.FC = () => {
  const { theme } = useStore();
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ServiceService.getAll()
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Erreur lors du chargement des services.');
        setLoading(false);
      });
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
    

      {/* Interactive Services Showcase */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Découvrez Nos Services
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sélectionnez un service pour en savoir plus sur nos réalisations
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-400">Chargement des services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Aucun service disponible.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Service Tabs */}
              <ServiceTabs
                services={services}
                activeIndex={activeService}
                onSelect={setActiveService}
                theme={theme}
              />
              
              {/* Service Details */}
              {services[activeService] && (
                <div className="space-y-6">
                  <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                    {services[activeService].coverImagePath && (
                      <div className="mb-6">
                        <img
                          src={getImageUrl(services[activeService].coverImagePath)}
                          alt={services[activeService].name}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      </div>
                    )}
                    <h3 className={`text-2xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {services[activeService].name}
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                      dangerouslySetInnerHTML={{ __html: services[activeService].description || '' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Projects, Products & Events Section */}
      {services[activeService] && (
        <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Projets, Produits & Événements
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Découvrez nos réalisations, produits et événements liés à {services[activeService].name}
              </p>
            </div>
            <ServiceProjects
              projects={services[activeService].projects || []}
              products={services[activeService].products || []}
              events={services[activeService].events || []}
              theme={theme}
            />
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Notre Processus
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Une approche méthodique pour garantir le succès de vos projets
            </p>
          </div>
          <ServiceProcess steps={processSteps} theme={theme} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image for CTA */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              alt="CTA Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <ServiceCTA
            title="Prêt à transformer votre entreprise ?"
            description="Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé"
            buttonText="Contactez-nous"
            onClick={() => window.location.href = '/contact'}
          />
        </div>
      </section>
    </div>
  );
};

export default Services;