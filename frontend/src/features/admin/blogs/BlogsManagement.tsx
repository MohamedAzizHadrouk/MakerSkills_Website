import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useStore } from '../../../stores/useStore';
import AnimatedSection from '../../../components/UI/AnimatedSection';
import BlogCard from './components/BlogCard';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import BlogService from './blogs.service';
import { Blog, CreateBlogDto } from './blog';
import BlogForm from './components/BlogForm';
import { useNavigate } from 'react-router-dom';

const BlogsManagement: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<CreateBlogDto>({
    title: '',
    cover: '',
    images: [],
    description: '',
  });
  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Charger les blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await BlogService.getAll();
      setBlogs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Ouvrir le formulaire pour création
  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({ title: '', cover: '', images: [],  description: '' });
    setCoverFiles([]);
    setImageFiles([]);
    setVideoFile(null);
    setShowForm(true);
  };

  // Ouvrir le formulaire pour édition
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      cover: blog.cover || '',
      images: blog.images || [],
      description: blog.description || '',
    });
    setCoverFiles([]);
    setImageFiles([]);
    setVideoFile(null);
    setShowForm(true);
  };

  // Voir le détail
  const handleDetail = (blog: Blog) => {
    navigate(`/admin/blogs/${blog._id}`);
  };

  // Suppression
  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await BlogService.delete(blogToDelete._id);
      setBlogs(blogs.filter(b => b._id !== blogToDelete._id));
    } finally {
      setConfirmOpen(false);
      setBlogToDelete(null);
    }
  };

  // Soumission du formulaire
  const handleFormSubmit = async (
    values: CreateBlogDto,
    coverFile: File,
    imageFiles?: File[]
  ) => {
    setFormLoading(true);
    try {
      if (editingBlog) {
        const { cover, ...valuesWithoutCover } = values;
        const updated = await BlogService.update(editingBlog._id, valuesWithoutCover, coverFile, imageFiles);
        setBlogs(blogs.map(b => (b._id === updated._id ? updated : b)));
      } else {
        const { cover, ...valuesWithoutCover } = values;
        const created = await BlogService.create(valuesWithoutCover, coverFile, imageFiles);
        setBlogs([created, ...blogs]);
      }
      setShowForm(false);
      setEditingBlog(null);
      setFormData({ title: '', cover: '', images: [],description: '' });
      setCoverFiles([]);
      setImageFiles([]);
    } finally {
      setFormLoading(false);
    }
  };

  // Filtrage
  const filteredBlogs = Array.isArray(blogs) ? blogs.filter(blog =>
    blog && blog.title &&
    (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  // Affichage du formulaire
  if (showForm) {
    return (
      <BlogForm
        initialValues={editingBlog ? {
          title: editingBlog.title,
          cover: editingBlog.cover || '',
          images: editingBlog.images || [],
          description: editingBlog.description || '',
        } : undefined}
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
        loading={formLoading}
        theme={theme}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Gestion des Blogs</h1>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Publiez, éditez et supprimez vos articles de blog</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau Blog</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Search */}
        <AnimatedSection>
          <div className={`p-6 rounded-xl mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <input
              type="text"
              placeholder="Rechercher un blog..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            />
          </div>
        </AnimatedSection>

        {/* Blogs Grid */}
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <AnimatedSection key={blog._id}>
                <BlogCard
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(blog)}
                  onDetail={handleDetail}
                  theme={theme}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
        {filteredBlogs.length === 0 && !loading && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>📝</div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aucun blog trouvé</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Essayez de modifier vos critères de recherche ou ajoutez un nouvel article.</p>
            </div>
          </AnimatedSection>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Supprimer le blog ?"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cet article ?"
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

export default BlogsManagement; 