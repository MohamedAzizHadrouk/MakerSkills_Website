import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../../../stores/useStore';
import AnimatedSection from '../../../components/UI/AnimatedSection';
import ReviewCard from './components/ReviewCard';
import ReviewForm from './components/ReviewForm';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import ReviewService from './review.service';
import { Review, CreateReviewDto } from './review';

const ReviewsManagement: React.FC = () => {
  const { theme } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Charger les reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.getAll();
      setReviews(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // CRUD
  const handleAdd = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = (review: Review) => {
    setReviewToDelete(review);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setFormLoading(true);
    try {
      await ReviewService.delete(reviewToDelete._id);
      setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
    } finally {
      setFormLoading(false);
      setConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleFormSubmit = async (values: CreateReviewDto, imageFile?: File) => {
    setFormLoading(true);
    try {
      if (editingReview) {
        const updated = await ReviewService.update(editingReview._id, values, imageFile);
        setReviews(reviews.map(r => (r._id === updated._id ? updated : r)));
      } else {
        const created = await ReviewService.create(values, imageFile);
        setReviews([created, ...reviews]);
      }
      setShowForm(false);
      setEditingReview(null);
    } finally {
      setFormLoading(false);
    }
  };

  // Filtrage
  const filteredReviews = Array.isArray(reviews) ? reviews.filter(review =>
    review && review.fullName &&
    (
      review.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.posteActuelle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestion des Avis</h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Modérez et valorisez les retours de vos clients</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nouvel Avis</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Search */}
        <AnimatedSection>
          <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <input
              type="text"
              placeholder="Rechercher un avis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>
        </AnimatedSection>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map(review => (
              <AnimatedSection key={review._id}>
                <div className="h-full">
                  <ReviewCard
                    review={review}
                    onEdit={handleEdit}
                    onDelete={() => handleDelete(review)}
                    theme={theme}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
        {filteredReviews.length === 0 && !loading && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📝</div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aucun avis trouvé</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Essayez de modifier vos critères de recherche ou ajoutez un nouvel avis.</p>
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
              <ReviewForm
                initialValues={editingReview || {}}
                onSubmit={handleFormSubmit}
                onCancel={() => { setShowForm(false); setEditingReview(null); }}
                loading={formLoading}
                theme={theme}
              />
            </motion.div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Supprimer l'avis ?"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cet avis ?"
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

export default ReviewsManagement;
