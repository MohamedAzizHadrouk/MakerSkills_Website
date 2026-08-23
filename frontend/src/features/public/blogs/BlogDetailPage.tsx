import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import BlogService from "../../admin/blogs/blogs.service";
import { Blog } from "../../admin/blogs/blog";
import { useStore } from "../../../stores/useStore";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import { routes, getEntitySlug } from "../../../shared/routes";
import { useCanonicalSlugRedirect } from "../../../shared/useCanonicalSlugRedirect";
import { PageMeta } from "../../../shared/PageMeta";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme } = useStore();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useCanonicalSlugRedirect(slug, blog?.slug, routes.blog);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        if (slug) {
          const data = await BlogService.getById(slug);
          setBlog(data);

          // Fetch related blogs (excluding current blog)
          const allBlogs = await BlogService.getAll();
          const related = allBlogs.filter((b) => b._id !== data._id).slice(0, 3);
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers!");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p
              className={`mt-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Chargement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Blog introuvable
            </h1>
            <Link
              to="/blogs"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images =
    blog.images && blog.images.length > 0
      ? blog.images.map((img) => getImageUrl(img))
      : [];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <PageMeta
        title={blog.title}
        description={blog.description}
        canonicalPath={routes.blog(getEntitySlug(blog))}
      />
      {/* Hero Section */}
      <section
        className={` relative py-20 ${
          theme === "dark" ? "bg-primary-900" : "bg-primary-900"
        }`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/blogs")}
            className="flex items-center mb-8 text-white/80 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour aux blogs
          </motion.button>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-6"
            >
              <Calendar className="h-5 w-5 mr-3 text-white/80" />
              <span className="text-white/80">
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date non disponible"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {blog.title}
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={sharePost}
              className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition-all duration-300"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Partager
            </motion.button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <img
                  src={getImageUrl(blog.cover)}
                  alt={blog.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
                />
              </motion.div>

              {/* Description */}
              {blog.description && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`prose prose-lg max-w-none mb-12 ${
                    theme === "dark"
                      ? "prose-invert prose-headings:text-white prose-p:text-gray-300 text-gray-300"
                      : "prose-headings:text-gray-900 prose-p:text-gray-700 text-gray-700"
                  }`}
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
              )}
              {/* Image Gallery */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12"
                >
                  <h3
                    className={`text-2xl font-bold mb-6 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Galerie d'images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                      <motion.img
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        src={img}
                        alt={`Image ${i + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                        onClick={() => setLightboxImg(img)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Blogs */}
              {relatedBlogs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`rounded-2xl p-6 ${
                    theme === "dark" ? "bg-gray-800" : "bg-white shadow-lg"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Articles similaires
                  </h3>
                  <div className="space-y-6">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        to={routes.blog(getEntitySlug(relatedBlog))}
                        className="block group"
                      >
                        <div className="flex space-x-4">
                          <img
                            src={getImageUrl(relatedBlog.cover)}
                            alt={relatedBlog.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium group-hover:text-orange-500 transition-colors duration-300 line-clamp-2 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {relatedBlog.title}
                            </h4>
                            <p
                              className={`text-sm mt-1 ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {relatedBlog.createdAt
                                ? new Date(
                                    relatedBlog.createdAt
                                  ).toLocaleDateString("fr-FR")
                                : ""}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            src={lightboxImg}
            alt="Agrandissement"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
};

export default BlogDetailPage;
