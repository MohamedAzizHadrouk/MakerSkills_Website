import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BlogService from './blogs.service';
import { Blog } from './blog';
import { useStore } from '../../../stores/useStore';
import { getImageUrl } from '../../../shared/utils/imageUtils';

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await BlogService.getById(id);
          setBlog(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-lg text-gray-500">Chargement...</div>;
  }
  if (!blog) {
    return <div className="text-center py-20 text-lg text-red-500">Blog introuvable</div>;
  }

  const images = blog.images && blog.images.length > 0 ? blog.images.map(img => getImageUrl(img)) : [];

  return (
    <div className={`min-h-screen  ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl w-full">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-8 text-sm font-medium gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
        >
          <ArrowLeft className="h-5 w-5" /> Retour
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Colonne gauche : images */}
          <div>
            {/* Cover */}
            <div className="mb-6">
              <img
                src={getImageUrl(blog.cover)}
                alt={blog.title}
                className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-lg"
              />
            </div>
            {/* Galerie images (hors cover) */}
            {images.length > 0 && (
              <div className="flex flex-row flex-wrap gap-4">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Image ${i + 1}`}
                    className="h-28 object-contain rounded-xl shadow cursor-pointer"
                    onClick={() => setLightboxImg(img)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Colonne droite : infos */}
          <div className="flex flex-col justify-start">
            <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h1>
            {blog.createdAt && (
              <div className={`mb-6 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Publié le {new Date(blog.createdAt).toLocaleDateString()}</div>
            )}
            {blog.description && (
              <div className={`prose max-w-none mb-8 ${theme === 'dark' ? 'prose-invert' : ''}`}
                dangerouslySetInnerHTML={{ __html: blog.description }} />
            )}
          </div>
        </div>
        {/* Lightbox simple */}
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightboxImg(null)}>
            <img src={lightboxImg} alt="Agrandissement" className="max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail; 
 