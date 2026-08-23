import React from 'react';
import { Service } from '../types/service';

interface Props {
  service: Service;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const ServiceDetailModal: React.FC<Props> = ({ service, onClose, theme }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-orange-500"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Détail du service</h2>
        <div className="mb-4">
          <img src={service.coverImagePath} alt={service.name} className="w-full h-48 object-cover rounded-xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
          <p className="mb-2">{service.description}</p>
          <div className="mb-2">
            <span className="font-semibold">Statut : </span>
            <span className={service.isActive ? 'text-green-500' : 'text-red-500'}>{service.isActive ? 'Actif' : 'Inactif'}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Catégories : </span>
            {service.categories && service.categories.length > 0 ? (
              service.categories.map(cat => (
                <span key={cat._id} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1">{cat.name}</span>
              ))
            ) : (
              <span>Aucune</span>
            )}
          </div>
        </div>
        {/* Projects */}
        <div className="mb-4">
          <span className="font-semibold">Projets liés :</span>
          {service.projects && service.projects.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {service.projects.map(project => (
                <li key={project._id}>
                  <span className="font-medium">{project.name}</span>
                  {project.description && <span className="ml-2 text-sm text-gray-400">{project.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <span className="ml-2">Aucun</span>
          )}
        </div>
        {/* Products */}
        <div className="mb-4">
          <span className="font-semibold">Produits liés :</span>
          {service.products && service.products.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {service.products.map(product => (
                <li key={product._id}>
                  <span className="font-medium">{product.name}</span>
                  {product.description && <span className="ml-2 text-sm text-gray-400">{product.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <span className="ml-2">Aucun</span>
          )}
        </div>
        {/* Events */}
        <div className="mb-4">
          <span className="font-semibold">Événements liés :</span>
          {service.events && service.events.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {service.events.map(event => (
                <li key={event._id}>
                  <span className="font-medium">{event.name}</span>
                  {event.description && <span className="ml-2 text-sm text-gray-400">{event.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <span className="ml-2">Aucun</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-6">
          Créé le {new Date(service.createdAt).toLocaleString('fr-FR')}<br />
          Modifié le {new Date(service.updatedAt).toLocaleString('fr-FR')}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal; 