import type { Laboratory, LaboratoryFormData, LaboratoryFilters } from '../types/laboratory';
import {
  LaboratoryService,
  LaboratoryCard,
  LaboratoryForm,
  LaboratoryFilters as LaboratoryFiltersComponent,
  BulkActions
} from '../index';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Square, Calendar, Clock, Mail, Phone, Eye, Trash2, CheckCircle, XCircle, X, Clock as ClockIcon } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import AnimatedSection from '../../../../components/UI/AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../../shared';
import { LaboratoryReservation } from '../services/laboratory.service';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

const LaboratoriesManagement: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  
  // États locaux
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [reservations, setReservations] = useState<LaboratoryReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [editingLaboratory, setEditingLaboratory] = useState<Laboratory | null>(null);
  const [selectedLaboratories, setSelectedLaboratories] = useState<string[]>([]);
  const [filters, setFilters] = useState<LaboratoryFilters>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<LaboratoryReservation | null>(null);
  const [showReservationDetail, setShowReservationDetail] = useState(false);
  const [showReservationDeleteConfirm, setShowReservationDeleteConfirm] = useState(false);
  const [reservationDeleteTarget, setReservationDeleteTarget] = useState<string | null>(null);
  const [updatingReservation, setUpdatingReservation] = useState<string | null>(null);
  
  // État du formulaire
  const [formData, setFormData] = useState<LaboratoryFormData>({
    title: '',
    description: '',
    imageUrl: '',
    hourlyRate: 0
  });

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  // Charger les données avec filtres
  useEffect(() => {
    loadLaboratories();
  }, [filters]);

  // Charger les réservations
  useEffect(() => {
    if (showReservations) {
      loadReservations();
    }
  }, [showReservations]);

  const loadData = async () => {
    try {
      setLoading(true);
      const laboratoriesData = await LaboratoryService.getAll();
      setLaboratories(laboratoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLaboratories = async () => {
    try {
      const laboratoriesData = await LaboratoryService.getAll(filters);
      setLaboratories(laboratoriesData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des laboratoires:', error);
      // Si l'erreur est liée au statut désactivé, afficher un message
      if (error?.response?.status === 503 || error?.message?.includes("problème dans cette rubrique")) {
        alert("Il y a un problème dans cette rubrique. Veuillez contacter le support.");
      }
    }
  };

  const loadReservations = async () => {
    try {
      setReservationsLoading(true);
      const reservationsData = await LaboratoryService.getAllReservations();
      if (Array.isArray(reservationsData)) {
        setReservations(reservationsData);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      setReservations([]);
      alert('Erreur lors du chargement des réservations. Veuillez vérifier la console pour plus de détails.');
    } finally {
      setReservationsLoading(false);
    }
  };

  // Gestion des réservations
  const handleViewReservationDetail = (reservation: LaboratoryReservation) => {
    setSelectedReservation(reservation);
    setShowReservationDetail(true);
  };

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      setUpdatingReservation(reservationId);
      await LaboratoryService.updateReservation(reservationId, { status: newStatus });
      await loadReservations();
      alert('Statut de la réservation mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingReservation(null);
    }
  };

  const handleDeleteReservation = (reservationId: string) => {
    setReservationDeleteTarget(reservationId);
    setShowReservationDeleteConfirm(true);
  };

  const confirmDeleteReservation = async () => {
    if (reservationDeleteTarget) {
      try {
        await LaboratoryService.deleteReservation(reservationDeleteTarget);
        await loadReservations();
        alert('Réservation supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la réservation');
      }
    }
    setShowReservationDeleteConfirm(false);
    setReservationDeleteTarget(null);
  };

  const cancelDeleteReservation = () => {
    setShowReservationDeleteConfirm(false);
    setReservationDeleteTarget(null);
  };

  // Gestionnaires d'événements
  const handleCreateLaboratory = () => {
    setEditingLaboratory(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      hourlyRate: 0
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleEditLaboratory = (laboratory: Laboratory) => {
    setEditingLaboratory(laboratory);
    setFormData({
      title: laboratory.title,
      description: laboratory.description || '',
      imageUrl: laboratory.imageUrl || '',
      hourlyRate: laboratory.hourlyRate
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const handleDeleteLaboratory = async (id: string) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await LaboratoryService.delete(deleteTarget);
        await loadLaboratories();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.title || formData.title.trim() === '') {
      alert('Le titre du laboratoire est requis');
      return;
    }
    
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      alert('Le tarif par heure doit être supérieur à 0');
      return;
    }
    
    try {
      const laboratoryData = {
        title: formData.title.trim(),
        description: formData.description || '',
        imageUrl: formData.imageUrl || '',
        hourlyRate: formData.hourlyRate
      };

      if (editingLaboratory) {
        await LaboratoryService.update(editingLaboratory._id, laboratoryData, imageFiles[0]);
      } else {
        await LaboratoryService.create(laboratoryData, imageFiles[0]);
      }

      setShowForm(false);
      await loadLaboratories();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la sauvegarde';
      
      // Si l'erreur est liée à l'authentification
      if (errorMessage.includes('Unauthorized') || 
          errorMessage.includes('Session expirée') || 
          errorMessage.includes('Authentication required') ||
          errorMessage.includes('Token invalide')) {
        alert('Votre session a expiré ou le token est invalide. Veuillez vous reconnecter.');
        const { logout } = useStore.getState();
        logout();
        navigate('/admin/login');
        return;
      }
      
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLaboratory(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      hourlyRate: 0
    });
    setImageFiles([]);
  };

  // Gestion de la sélection multiple
  const handleSelectLaboratory = (id: string) => {
    setSelectedLaboratories(prev => 
      prev.includes(id) 
        ? prev.filter(labId => labId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLaboratories.length === laboratories.length) {
      setSelectedLaboratories([]);
    } else {
      setSelectedLaboratories(laboratories.map(lab => lab._id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await LaboratoryService.bulkDelete(selectedLaboratories);
      setSelectedLaboratories([]);
      await loadLaboratories();
    } catch (error) {
      console.error('Erreur lors de la suppression en lot:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedLaboratories([]);
  };

  const handleShowDetail = (laboratory: Laboratory) => {
    navigate(`/admin/laboratories/${laboratory._id}`);
  };

  if (showForm) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8">
          <LaboratoryForm
            theme={theme}
            editingLaboratory={editingLaboratory}
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
                Gestion des Laboratoires
              </h1>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gérez vos laboratoires et leurs matériels
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowReservations(!showReservations);
                  if (!showReservations && reservations.length === 0) {
                    loadReservations();
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  showReservations
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Réservations</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateLaboratory}
                className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Nouveau Laboratoire</span>
              </motion.button>
            </div>
          </div>
        </AnimatedSection>

        {/* Section Réservations */}
        {showReservations && (
          <AnimatedSection>
            <div className={`mb-8 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6 border-b border-gray-700 dark:border-gray-600">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Réservations des Laboratoires
                </h2>
                <p className={`mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Liste de toutes les réservations
                </p>
              </div>

              {reservationsLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className={`mt-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Chargement des réservations...
                  </p>
                </div>
              ) : reservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Client
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Laboratoire
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Date
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Plage horaire
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Coût total
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Statut
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 dark:divide-gray-600">
                      {reservations.map((reservation) => {
                        const laboratory = typeof reservation.laboratoryId === 'object' 
                          ? reservation.laboratoryId 
                          : laboratories.find(l => l._id === reservation.laboratoryId);
                        const reservationDate = new Date(reservation.reservationDate);

                        return (
                          <tr key={reservation._id} className={`${
                            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          } transition-colors`}>
                            <td className="px-6 py-4">
                              <div>
                                <div className={`font-medium ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {reservation.fullName}
                                </div>
                                <div className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                } flex items-center space-x-4 mt-1`}>
                                  <span className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {reservation.email}
                                  </span>
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {reservation.phoneNumber}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {laboratory ? (typeof laboratory === 'object' ? laboratory.title : '') : 'N/A'}
                            </td>
                            <td className={`px-6 py-4 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {reservationDate.toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {reservation.startTime} - {reservation.endTime}
                              </div>
                            </td>
                            <td className={`px-6 py-4 font-semibold ${
                              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                            }`}>
                              {reservation.totalCost?.toFixed(2) || 'N/A'} DT
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                statusColors[reservation.status as keyof typeof statusColors] || statusColors.pending
                              }`}>
                                {statusLabels[reservation.status as keyof typeof statusLabels] || reservation.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleViewReservationDetail(reservation)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    theme === 'dark'
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                                  }`}
                                  title="Voir les détails"
                                >
                                  <Eye className="h-4 w-4" />
                                </motion.button>
                                
                                {reservation.status !== 'confirmed' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleUpdateReservationStatus(reservation._id, 'confirmed')}
                                    disabled={updatingReservation === reservation._id}
                                    className={`p-2 rounded-lg transition-colors ${
                                      updatingReservation === reservation._id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : theme === 'dark'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                    title="Valider"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </motion.button>
                                )}
                                
                                {reservation.status !== 'cancelled' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleUpdateReservationStatus(reservation._id, 'cancelled')}
                                    disabled={updatingReservation === reservation._id}
                                    className={`p-2 rounded-lg transition-colors ${
                                      updatingReservation === reservation._id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : theme === 'dark'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                                    title="Rejeter"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </motion.button>
                                )}
                                
                                {reservation.status !== 'pending' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleUpdateReservationStatus(reservation._id, 'pending')}
                                    disabled={updatingReservation === reservation._id}
                                    className={`p-2 rounded-lg transition-colors ${
                                      updatingReservation === reservation._id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : theme === 'dark'
                                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                    }`}
                                    title="Remettre en attente"
                                  >
                                    <ClockIcon className="h-4 w-4" />
                                  </motion.button>
                                )}
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteReservation(reservation._id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    theme === 'dark'
                                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                                  }`}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Calendar className={`h-16 w-16 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Aucune réservation
                  </h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Il n'y a pas de réservations pour le moment.
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Filtres */}
        <AnimatedSection>
          <div className="mb-6">
            <LaboratoryFiltersComponent
              theme={theme}
              filters={filters}
              setFilters={setFilters}
              selectedLaboratories={selectedLaboratories}
              laboratoriesCount={laboratories.length}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
            />
          </div>
        </AnimatedSection>

        {/* Grille des laboratoires */}
        {loading ? (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className={`mt-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Chargement des laboratoires...
              </p>
            </div>
          </AnimatedSection>
        ) : laboratories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {laboratories.map((laboratory, index) => (
              <AnimatedSection key={laboratory._id} delay={index * 0.1}>
                <div className="relative">
                  {/* Checkbox de sélection */}
                  <div className="absolute top-4 left-4 z-10">
                    <button
                      onClick={() => handleSelectLaboratory(laboratory._id)}
                      className={`p-1 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
                      }`}
                    >
                      {selectedLaboratories.includes(laboratory._id) ? (
                        <CheckSquare className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <LaboratoryCard
                    laboratory={laboratory}
                    onEdit={handleEditLaboratory}
                    onDelete={handleDeleteLaboratory}
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
                🔬
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Aucun laboratoire trouvé
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Essayez de modifier vos critères de recherche ou créez un nouveau laboratoire.
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Actions en lot */}
        <BulkActions
          theme={theme}
          selectedLaboratories={selectedLaboratories}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Supprimer le laboratoire"
          message="Êtes-vous sûr de vouloir supprimer ce laboratoire ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        <ConfirmDialog
          isOpen={showReservationDeleteConfirm}
          title="Supprimer la réservation"
          message="Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={confirmDeleteReservation}
          onCancel={cancelDeleteReservation}
        />

        {/* Modal de détails de réservation */}
        <AnimatePresence>
          {showReservationDetail && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowReservationDetail(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Détails de la réservation
                </h2>
                <button
                  onClick={() => setShowReservationDetail(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Informations client */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Informations client
                  </h3>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nom complet</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedReservation.fullName}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedReservation.email}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Téléphone</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {selectedReservation.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Statut</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[selectedReservation.status as keyof typeof statusColors] || statusColors.pending
                      }`}>
                        {statusLabels[selectedReservation.status as keyof typeof statusLabels] || selectedReservation.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations laboratoire */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Laboratoire
                  </h3>
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    {(() => {
                      const laboratory = typeof selectedReservation.laboratoryId === 'object'
                        ? selectedReservation.laboratoryId
                        : laboratories.find(l => l._id === selectedReservation.laboratoryId);
                      
                      if (!laboratory || typeof laboratory !== 'object') {
                        return <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Laboratoire non trouvé</p>;
                      }

                      return (
                        <div>
                          <p className={`font-semibold text-lg mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {laboratory.title}
                          </p>
                          {laboratory.description && (
                            <p className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {laboratory.description}
                            </p>
                          )}
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Tarif horaire: <span className="font-semibold text-orange-500">{laboratory.hourlyRate} DT/heure</span>
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Informations de réservation */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Informations de réservation
                  </h3>
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                      <p className={`font-medium flex items-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(selectedReservation.reservationDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Heure de début</p>
                      <p className={`font-medium flex items-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedReservation.startTime}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Heure de fin</p>
                      <p className={`font-medium flex items-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Clock className="h-4 w-4 mr-2" />
                        {selectedReservation.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matériels */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Matériels réservés
                  </h3>
                  {selectedReservation.materials && selectedReservation.materials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedReservation.materials.map((material) => {
                        const materialObj = typeof material === 'object' ? material : null;
                        if (!materialObj) return null;

                        return (
                          <div key={materialObj._id} className={`p-4 rounded-lg border ${
                            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className={`font-semibold ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {materialObj.name}
                                </p>
                                {materialObj.description && (
                                  <p className={`text-sm mt-1 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {materialObj.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className={`text-sm ${
                                materialObj.isFree
                                  ? 'text-green-600'
                                  : theme === 'dark'
                                  ? 'text-orange-400'
                                  : 'text-orange-600'
                              }`}>
                                {materialObj.isFree ? 'Gratuit' : `${materialObj.hourlyRate} DT/heure`}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                materialObj.status === 'available'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {materialObj.status === 'available' ? 'Disponible' : materialObj.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg text-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Aucun matériel réservé
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes et coût */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReservation.notes && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Notes
                      </h3>
                      <div className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedReservation.notes}
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Coût total
                    </h3>
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {selectedReservation.totalCost?.toFixed(2) || 'N/A'} DT
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates de création et modification */}
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Réservation créée le {new Date(selectedReservation.createdAt).toLocaleString('fr-FR')}
                    {selectedReservation.updatedAt && selectedReservation.updatedAt !== selectedReservation.createdAt && (
                      <span> • Modifiée le {new Date(selectedReservation.updatedAt).toLocaleString('fr-FR')}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className={`sticky bottom-0 flex items-center justify-end space-x-3 p-6 border-t ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReservationDetail(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LaboratoriesManagement;

