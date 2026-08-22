import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Tag } from 'lucide-react';
import { useStore } from '../../../../stores/useStore';
import { ConfirmDialog } from '../../../../shared';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import BulkActions from '../components/BulkActions';
import Pagination from '../../../../components/admin/Pagination';
import { CreateProductDto, Product } from '../types/product';
import { productService } from '../services/product.service';
import { categoryService } from '../../categories/services/category.service';

const ProductsManagement: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; isBulk: boolean } | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
    category: '',
    events: []
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; label: string }[]>([]);

  // Charger les catégories directement sans hook
  const loadCategories = async () => {
    try {
      const categories = await categoryService.getCategories('product');
      const formattedCategories = [
        { id: "all", label: "Tous" },
        ...categories.map((cat) => ({
          id: cat._id,
          label: cat.name,
        })),
      ];
      setCategoryOptions(formattedCategories);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setCategoryOptions([{ id: "all", label: "Tous" }]);
    }
  };

  // Charger les catégories pour le formulaire (sans "Tous")
  const loadCategoriesForForm = async () => {
    try {
      const categories = await categoryService.getCategories('product');
      const formattedCategories = categories.map((cat) => ({
        id: cat._id,
        label: cat.name,
      }));
      return formattedCategories;
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      return [];
    }
  };

  // Charger les produits
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
      console.log("dataa", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

 

  // Gérer l'état de navigation depuis ProductDetail
  useEffect(() => {
    if (location.state?.editProduct && location.state?.showForm) {
      const productToEdit = location.state.editProduct as Product;
      setEditingProduct(productToEdit);
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        category: productToEdit.category 
          ? (typeof productToEdit.category === 'string' ? productToEdit.category : productToEdit.category._id)
          : '',
        events: (productToEdit.events || []).map(event => typeof event === 'string' ? event : event._id)
      });
      setImageFiles([]);
      setVideoFile(null);
      setShowForm(true);
      
      // Nettoyer l'état de navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Filtrer les produits
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || 
      (product.category 
        ? (typeof product.category === 'string' ? product.category : product.category._id)
        : null
      ) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Gestion des actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData, imageFiles.length > 0 ? imageFiles : undefined, videoFile || undefined);
      } else {
        await productService.createProduct(formData, imageFiles.length > 0 ? imageFiles : undefined, videoFile || undefined);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: '', events: [] });
      setImageFiles([]);
      setVideoFile(null);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category 
        ? (typeof product.category === 'string' ? product.category : product.category._id)
        : '',
      events: (product.events || []).map(event => typeof event === 'string' ? event : event._id)
    });
    setImageFiles([]);
    setVideoFile(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget({ id, isBulk: false });
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget({ id: '', isBulk: true });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.isBulk) {
        await Promise.all(selectedProducts.map(id => productService.deleteProduct(id)));
        setSelectedProducts([]);
      } else {
        await productService.deleteProduct(deleteTarget.id);
      }
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, category: '', events: [] });
    setImageFiles([]);
    setVideoFile(null);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/admin/products/${productId}`);
  };

  // Afficher le formulaire si nécessaire
  if (showForm) {
    return (
      <ProductForm
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        videoFile={videoFile}
        setVideoFile={setVideoFile}
        categories={categoryOptions.filter(cat => cat.id !== 'all')}
        onSubmit={handleSubmit}
        onCancel={handleCancelForm}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Gestion des Produits
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez votre catalogue de produits et stock
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau Produit</span>
        </motion.button>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
        } border`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
            {error}
          </p>
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedProducts.length}
        onDeselectAll={() => setSelectedProducts([])}
        onBulkDelete={handleBulkDelete}
      />

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        categories={categoryOptions}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedProducts.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            isSelected={selectedProducts.includes(product._id)}
            onSelect={handleSelectProduct}
            onEdit={handleEdit}
            onDelete={handleDelete}
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {!loading && paginatedProducts.length === 0 && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
          <p>Commencez par ajouter votre premier produit</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-orange-500 border-t-transparent rounded-full" />
          <p>Chargement des produits...</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`rounded-2xl overflow-hidden shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
            showItemsPerPage={true}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={deleteTarget?.isBulk ? 'Supprimer les produits' : 'Supprimer le produit'}
        message={
          deleteTarget?.isBulk
            ? `Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ?`
            : 'Êtes-vous sûr de vouloir supprimer ce produit ?'
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default ProductsManagement;