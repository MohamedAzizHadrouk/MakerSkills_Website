import type { Service, ServiceFormData, ServiceFilters, Category } from '../types/service';
import {
  ServiceService,
  ServiceCard,
  ServiceForm,
  ServiceFilters as ServiceFiltersComponent,
  BulkActions
} from '../index';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Square } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../../shared';

const ServicesManagement: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  
  // États locaux
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [filters, setFilters] = useState<ServiceFilters>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  // État du formulaire
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    categories: [],
    isActive: true,
    events: [],
    projects: [],
    products: []
  });

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  // Charger les données avec filtres
  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        ServiceService.getAll(),
        ServiceService.getCategories()
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const servicesData = await ServiceService.getAll(filters);
      setServices(servicesData);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    }
  };

  // Gestionnaires d'événements
  const handleCreateService = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      categories: [],
      isActive: true,
      events: [],
      projects: [],
      products: []
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      categories: service.categories?.map(cat => cat._id) || [],
      isActive: service.isActive || true,
      events: service.events?.map(e => e._id) || [],
      projects: service.projects?.map(p => p._id) || [],
      products: service.products?.map(p => p._id) || []
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleDeleteService = async (id: string) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await ServiceService.delete(deleteTarget);
        await loadServices();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await ServiceService.updateStatus(id, isActive);
      await loadServices();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        categories: formData.categories,
        isActive: formData.isActive,
        events: formData.events,
        projects: formData.projects,
        products: formData.products
      };

      if (editingService) {
        await ServiceService.update(editingService._id, serviceData, imageFiles[0]);
      } else {
        await ServiceService.create(serviceData, imageFiles[0]);
      }

      setShowForm(false);
      await loadServices();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      categories: [],
      isActive: true,
      events: [],
      projects: [],
      products: []
    });
    setImageFiles([]);
  };

  // Gestion de la sélection multiple
  const handleSelectService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(serviceId => serviceId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map(service => service._id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await ServiceService.bulkDelete(selectedServices);
      setSelectedServices([]);
      await loadServices();
    } catch (error) {
      console.error('Erreur lors de la suppression en lot:', error);
    }
  };

  const handleBulkActivate = async () => {
    try {
      await ServiceService.bulkUpdateStatus(selectedServices, true);
      setSelectedServices([]);
      await loadServices();
    } catch (error) {
      console.error('Erreur lors de l\'activation en lot:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await ServiceService.bulkUpdateStatus(selectedServices, false);
      setSelectedServices([]);
      await loadServices();
    } catch (error) {
      console.error('Erreur lors de la désactivation en lot:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedServices([]);
  };

  const handleShowDetail = (service: Service) => {
    navigate(`/admin/services/${service._id}`);
  };

  if (showForm) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8">
          <ServiceForm
            theme={theme}
            editingService={editingService}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            formData={formData}
            setFormData={setFormData}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Gestion des Services
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gérez vos services et offres commerciales
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateService}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau Service</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Filtres */}
        <AnimatedSection>
          <ServiceFiltersComponent
            theme={theme}
            filters={filters}
            setFilters={setFilters}
            categories={categories}
          />
        </AnimatedSection>

        {/* Sélection multiple */}
        {services.length > 0 && (
          <AnimatedSection>
            <div className={`p-4 rounded-xl mb-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className={`flex items-center space-x-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {selectedServices.length === services.length ? (
                    <CheckSquare className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {selectedServices.length === services.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </span>
                </button>
                
                {selectedServices.length > 0 && (
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedServices.length} service(s) sélectionné(s)
                  </span>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Grille des services */}
        {loading ? (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className={`mt-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Chargement des services...
              </p>
            </div>
          </AnimatedSection>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {services.map((service, index) => (
              <AnimatedSection key={service._id} delay={index * 0.1}>
                <div className="relative">
                  {/* Checkbox de sélection */}
                  <div className="absolute top-4 left-4 z-10">
                    <button
                      onClick={() => handleSelectService(service._id)}
                      className={`p-1 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
                      }`}
                    >
                      {selectedServices.includes(service._id) ? (
                        <CheckSquare className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <ServiceCard
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onToggleStatus={handleToggleStatus}
                    theme={theme}
                    onShowDetail={handleShowDetail}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                🛠️
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Aucun service trouvé
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Essayez de modifier vos critères de recherche ou créez un nouveau service.
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Actions en lot */}
        <BulkActions
          theme={theme}
          selectedServices={selectedServices}
          onBulkDelete={handleBulkDelete}
          onBulkActivate={handleBulkActivate}
          onBulkDeactivate={handleBulkDeactivate}
          onClearSelection={handleClearSelection}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Supprimer le service"
          message="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </div>
  );
};

export default ServicesManagement;