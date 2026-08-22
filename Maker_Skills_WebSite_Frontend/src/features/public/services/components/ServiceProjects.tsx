import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { Project,  Event } from '../../../admin/services/types/service';
import { getImageUrl } from '../../../../shared/utils/imageUtils';
import { Product } from '../../../admin/products';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface ServiceProjectsProps {
  projects: Project[];
  products: Product[];
  events: Event[];
  theme: 'light' | 'dark';
}

const truncate = (text?: string, max = 80) => {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
};

const Card: React.FC<{
  image?: string;
  title: string;
  description?: string;
  theme: 'light' | 'dark';
  children?: React.ReactNode;
  type: 'project' | 'product' | 'event';
}> = ({ image, title, description, theme, children, type }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className={`rounded-2xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex flex-col border border-gray-200 dark:border-gray-700 w-full sm:w-64 md:w-72 min-w-[220px]`}
    style={{ minHeight: 320, height: 420 }}
  >
    <div className="relative w-full aspect-[4/4] flex items-center justify-center overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={title}
          className={`w-full h-full  block ${type === 'product' ? 'object-contain' : 'object-contain'}`}
        />
      ) : (
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center ${
            type === 'project' ? 'bg-blue-500' : 
            type === 'product' ? 'bg-green-500' : 'bg-purple-500'
          }`}>
            <span className="text-white text-2xl font-bold">
              {type === 'project' ? 'P' : type === 'product' ? 'PR' : 'E'}
            </span>
          </div>
          <span className="text-gray-400 text-sm">Pas d'image</span>
        </div>
      )}
      <div className="absolute top-3 right-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          type === 'project' ? 'bg-blue-100 text-blue-800' :
          type === 'product' ? 'bg-green-100 text-green-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {type === 'project' ? 'Projet' : type === 'product' ? 'Produit' : 'Événement'}
        </span>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {description && (
        <div className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis'}}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      <div className="mt-auto">
        {children}
      </div>
    </div>
  </motion.div>
);

const ServiceProjects: React.FC<ServiceProjectsProps> = ({ projects, products, events, theme }) => {
  // Vérifier si toutes les sections sont vides
  const hasProjects = projects && projects.length > 0;
  const hasProducts = products && products.length > 0;
  const hasEvents = events && events.length > 0;

  // Si toutes les sections sont vides, ne rien afficher
  if (!hasProjects && !hasProducts && !hasEvents) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📁</span>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Aucun contenu disponible
        </h3>
        <p className={`text-gray-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Ce service n'a pas encore de projets, produits ou événements associés.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Projets - Afficher seulement s'il y en a */}
      {hasProjects && (
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center ">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Projets réalisés ({projects.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 ">
            {projects.map((project, index) => (
              <AnimatedSection key={project._id || index} delay={index * 0.1}>
                <Card
                  image={project.coverImage ? getImageUrl(project.coverImage) : undefined}
                  title={project.name}
                  description={project.description}
                  theme={theme}
                  type="project"
                >
                  <div className="space-y-2">
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {project.startDate && project.endDate
                          ? `${project.startDate} - ${project.endDate}`
                          : project.startDate || project.endDate || ''}
                      </div>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {/* Produits - Afficher seulement s'il y en a */}
      {hasProducts && (
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">PR</span>
            </div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Produits liés ({products.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <AnimatedSection key={product._id || index} delay={index * 0.1}>
                <Card
                  image={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : undefined}
                  title={product.name}
                  description={product.description}
                  theme={theme}
                  type="product"
                >
                  {product.price && (
                    <div className="text-sm font-semibold text-green-600">
                      {product.price} €
                    </div>
                  )}
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {/* Événements - Afficher seulement s'il y en a */}
      {hasEvents && (
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Événements liés ({events.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {events.map((event, index) => (
              <AnimatedSection key={event._id || index} delay={index * 0.1}>
                <Card
                  title={event.name}
                  description={event.description}
                  theme={theme}
                  type="event"
                >
                  <div className="space-y-2">
                    {(event.startDate || event.endDate) && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {event.startDate && event.endDate
                          ? `${event.startDate} - ${event.endDate}`
                          : event.startDate || event.endDate || ''}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProjects; 