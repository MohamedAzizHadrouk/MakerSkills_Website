import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, Plus, DollarSign } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import { Laboratory, Material, MaterialFormData } from '../types/laboratory';
import { LaboratoryService } from '../services/laboratory.service';
import { getImageUrl } from '../../../../shared/utils/imageUtils';
import { ConfirmDialog } from '../../../../shared';
import MaterialCard from '../components/MaterialCard';
import MaterialForm from '../components/MaterialForm';
import AnimatedSection from '../../../../components/UI/AnimatedSection';

const LaboratoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [laboratory, setLaboratory] = useState<Laboratory | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialFormData, setMaterialFormData] = useState<MaterialFormData>({
    name: '',
    description: '',
    type: '',
    hourlyRate: 0,
    isFree: false,
    status: 'available'
  });
  const [showMaterialDeleteConfirm, setShowMaterialDeleteConfirm] = useState(false);
  const [deleteMaterialTarget, setDeleteMaterialTarget] = useState<string | null>(null);
  const [materialImageFiles, setMaterialImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
      loadLaboratory();
      loadMaterials();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadLaboratory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await LaboratoryService.getById(id!);
      setLaboratory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const data = await LaboratoryService.getMaterials(id!);
      setMaterials(data);
    } catch (err) {
      console.error('Erreur lors du chargement des matériels:', err);
    }
  };

  const handleDelete = async () => {
    if (!laboratory) return;
    try {
      await LaboratoryService.delete(laboratory._id);
      navigate('/admin/laboratories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const handleEdit = () => {
    if (!laboratory) return;
    navigate('/admin/laboratories', {
      state: {
        editLaboratory: laboratory,
        showForm: true
      }
    });
  };

  const handleCreateMaterial = () => {
    setEditingMaterial(null);
    setMaterialFormData({
      name: '',
      description: '',
      type: '',
      hourlyRate: 0,
      isFree: false,
      status: 'available'
    });
    setMaterialImageFiles([]);
    setShowMaterialForm(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setMaterialImageFiles([]);
    setMaterialFormData({
      name: material.name,
      description: material.description || '',
      type: material.type,
      hourlyRate: material.hourlyRate || 0,
      isFree: material.isFree,
      status: material.status
    });
    setShowMaterialForm(true);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setDeleteMaterialTarget(materialId);
    setShowMaterialDeleteConfirm(true);
  };

  const confirmDeleteMaterial = async () => {
    if (deleteMaterialTarget && id) {
      try {
        await LaboratoryService.deleteMaterial(id, deleteMaterialTarget);
        await loadMaterials();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
    setShowMaterialDeleteConfirm(false);
    setDeleteMaterialTarget(null);
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const materialData = {
        name: materialFormData.name,
        description: materialFormData.description,
        type: materialFormData.type,
        hourlyRate: materialFormData.isFree ? undefined : materialFormData.hourlyRate,
        isFree: materialFormData.isFree,
        status: materialFormData.status,
        laboratoryId: id
      };

      const imageFile = materialImageFiles.length > 0 ? materialImageFiles[0] : undefined;

      if (editingMaterial) {
        await LaboratoryService.updateMaterial(id, editingMaterial._id, materialData, imageFile);
      } else {
        await LaboratoryService.createMaterial(id, materialData, imageFile);
      }

      setShowMaterialForm(false);
      setEditingMaterial(null);
      setMaterialImageFiles([]);
      await loadMaterials();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  const handleMaterialCancel = () => {
    setShowMaterialForm(false);
    setEditingMaterial(null);
    setMaterialImageFiles([]);
    setMaterialFormData({
      name: '',
      description: '',
      type: '',
      hourlyRate: 0,
      isFree: false,
      status: 'available'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !laboratory) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{error || 'Laboratoire non trouvé'}</p>
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
              onClick={() => navigate('/admin/laboratories')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{laboratory.title}</h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Détail du laboratoire</p>
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
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
              src={getImageUrl(laboratory.coverImagePath || laboratory.imageUrl)}
              alt={laboratory.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Infos laboratoire */}
          <div className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{laboratory.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                  <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {laboratory.hourlyRate} TND/heure
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Description</h3>
              <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>{laboratory.description || 'Aucune description disponible.'}</div>
            </div>
          </div>
        </div>

        {/* Section Matériels */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Matériels ({materials.length})
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateMaterial}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter un matériel</span>
            </motion.button>
          </div>

          {showMaterialForm && (
            <AnimatedSection>
              <div className={`mb-6 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <MaterialForm
                  theme={theme}
                  editingMaterial={editingMaterial}
                  loading={false}
                  onSubmit={handleMaterialSubmit}
                  onCancel={handleMaterialCancel}
                  formData={materialFormData}
                  setFormData={setMaterialFormData}
                  imageFiles={materialImageFiles}
                  setImageFiles={setMaterialImageFiles}
                  laboratoryId={id!}
                />
              </div>
            </AnimatedSection>
          )}

          {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <AnimatedSection key={material._id} delay={index * 0.1}>
                  <MaterialCard
                    material={material}
                    onEdit={handleEditMaterial}
                    onDelete={handleDeleteMaterial}
                    theme={theme}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className={`text-center py-12 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                  🛠️
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Aucun matériel
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ajoutez des matériels à ce laboratoire pour commencer.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>

        {laboratory.createdAt && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Créé le {new Date(laboratory.createdAt).toLocaleDateString('fr-FR')}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Modifié le {new Date(laboratory.updatedAt).toLocaleDateString('fr-FR')}</p>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Supprimer le laboratoire"
          message={`Êtes-vous sûr de vouloir supprimer "${laboratory.title}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />

        <ConfirmDialog
          isOpen={showMaterialDeleteConfirm}
          title="Supprimer le matériel"
          message="Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible."
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={confirmDeleteMaterial}
          onCancel={() => setShowMaterialDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};

export default LaboratoryDetail;

