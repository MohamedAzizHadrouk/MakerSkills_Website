import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import { Service } from '../types/service';
import ServiceService from '../services/service.service';
import { getImageUrl } from '../../../../shared/utils/imageUtils';
import { ConfirmDialog } from '../../../../shared';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadService();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadService = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ServiceService.getById(id!);
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    try {
      await ServiceService.delete(service._id);
      navigate('/admin/services');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleEdit = () => {
    if (!service) return;
    navigate('/admin/services', {
      state: {
        editService: service,
        showForm: true
      }
    });
  };

  const getProjectImage = (project: any): string => {
    if (!project || typeof project === 'string') return '/placeholder-project.png';
    return project.coverImage ? getImageUrl(project.coverImage) : '/placeholder-project.png';
  };

  const getProductImage = (product: any): string => {
    if (!product || typeof product === 'string') return '/placeholder-product.png';
    if (product.images && product.images.length > 0) return getImageUrl(product.images[0]);
    return '/placeholder-product.png';
  };

  const getEventImage = (event: any): string => {
    // Placeholder, à adapter si tu as des images d'event
    return '/placeholder-event.png';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{error || 'Service non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/services')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{service.name}</h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Détail du service</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image principale */}
          <div className="space-y-6">
            <img
              src={getImageUrl(service.coverImagePath)}
              alt={service.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Infos service */}
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{service.name}</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{service.isActive ? 'Actif' : 'Inactif'}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {service.categories && service.categories.length > 0 ? service.categories.map(cat => cat.name).join(', ') : 'Aucune catégorie'}
                </span>
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Description</h3>
              <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: service.description || 'Aucune description disponible.' }}
              />
            </div>
          </div>
        </div>

        {/* Projets liés */}
        {service.projects && service.projects.length > 0 && (
          <div className="mt-8 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Projets liés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {service.projects.map((project, idx) => (
                <div key={project._id || idx} className={`rounded-lg overflow-hidden shadow-md transition-all ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} flex flex-col items-center w-64`} style={{ minWidth: 220 }}>
                  <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-gray-900">
                    <img src={getProjectImage(project)} alt={project.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`w-full py-3 px-2 flex items-center justify-center bg-white dark:bg-gray-900`}>
                    <h4 className={`font-semibold text-center w-full break-words ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Produits liés */}
        {service.products && service.products.length > 0 && (
          <div className="mt-8 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Produits liés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {service.products.map((product, idx) => (
                <div key={product._id || idx} className={`rounded-lg overflow-hidden shadow-md transition-all ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} flex flex-col items-center w-64`} style={{ minWidth: 220 }}>
                  <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-gray-900">
                    <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`w-full py-3 px-2 flex items-center justify-center bg-white dark:bg-gray-900`}>
                    <h4 className={`font-semibold text-center w-full break-words ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{product.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Événements liés */}
        {service.events && service.events.length > 0 && (
          <div className="mt-8 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
            <h3 className={`text-xl font-semibold mb-6 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Événements liés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {service.events.map((event, idx) => (
                <div key={event._id || idx} className={`rounded-lg overflow-hidden shadow-md transition-all ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} flex flex-col items-center w-64`} style={{ minWidth: 220 }}>
                  <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-gray-900">
                    <img src={getEventImage(event)} alt={event.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`w-full py-3 px-2 flex items-center justify-center bg-white dark:bg-gray-900`}>
                    <h4 className={`font-semibold text-center w-full break-words ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{event.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {service.createdAt && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Créé le {new Date(service.createdAt).toLocaleDateString('fr-FR')}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Modifié le {new Date(service.updatedAt).toLocaleDateString('fr-FR')}</p>
          </div>
        )}
        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Supprimer le service"
          message={`Êtes-vous sûr de vouloir supprimer "${service.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};

export default ServiceDetail; 