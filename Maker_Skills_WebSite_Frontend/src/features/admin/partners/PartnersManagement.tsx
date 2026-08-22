import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../../../stores/useStore';
import AnimatedSection from '../../../components/UI/AnimatedSection';
import PartnerCard from './components/PartnerCard';
import PartnerForm from './components/PartnerForm';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import PartnerService from './partner.service';
import { Partner, CreatePartnerDto } from './partner';

const PartnersManagement: React.FC = () => {
  const { theme } = useStore();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Charger les partenaires
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await PartnerService.getAll();
      setPartners(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // CRUD
  const handleAdd = () => {
    setEditingPartner(null);
    setShowForm(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setShowForm(true);
  };

  const handleDelete = (partner: Partner) => {
    setPartnerToDelete(partner);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!partnerToDelete) return;
    setFormLoading(true);
    try {
      await PartnerService.delete(partnerToDelete._id);
      setPartners(partners.filter(p => p._id !== partnerToDelete._id));
    } finally {
      setFormLoading(false);
      setConfirmOpen(false);
      setPartnerToDelete(null);
    }
  };

  const handleFormSubmit = async (values: CreatePartnerDto, logoFile?: File) => {
    setFormLoading(true);
    try {
      if (editingPartner) {
        const updated = await PartnerService.update(editingPartner._id, values, logoFile);
        setPartners(partners.map(p => (p._id === updated._id ? updated : p)));
      } else {
        const created = await PartnerService.create(values, logoFile);
        setPartners([created, ...partners]);
      }
      setShowForm(false);
      setEditingPartner(null);
    } finally {
      setFormLoading(false);
    }
  };

  // Filtrage
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestion des Partenaires</h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Gérez votre réseau de partenaires stratégiques</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau Partenaire</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Search */}
        <AnimatedSection>
          <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <input
              type="text"
              placeholder="Rechercher un partenaire..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>
        </AnimatedSection>

        {/* Partners Grid */}
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map(partner => (
              <AnimatedSection key={partner._id}>
                <PartnerCard
                  partner={partner}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(partner)}
                  theme={theme}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
        {filteredPartners.length === 0 && !loading && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>🤝</div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aucun partenaire trouvé</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Essayez de modifier vos critères de recherche ou ajoutez un nouveau partenaire.</p>
            </div>
          </AnimatedSection>
        )}

        {/* Form Dialog */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg mx-4 z-10"
            >
              <PartnerForm
                initialValues={editingPartner || {}}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingPartner(null); }}
                loading={formLoading}
                theme={theme}
              />
            </motion.div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Supprimer le partenaire ?"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer ce partenaire ?"
          confirmText="Supprimer"
          cancelText="Annuler"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default PartnersManagement;