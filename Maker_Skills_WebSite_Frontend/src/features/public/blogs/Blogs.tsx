import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import BlogService from "../../admin/blogs/blogs.service";
import { Blog } from "../../admin/blogs/blog";
import { useStore } from "../../../stores/useStore";
import { getImageUrl } from "../../../shared/utils/imageUtils";
import { routes, getEntitySlug } from "../../../shared/routes";

const Blogs: React.FC = () => {
  const { theme } = useStore();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await BlogService.getAll();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p
              className={`mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            >
              Chargement des blogs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}
    >
      {/* Hero Section */}
      <section className={` relative py-20 ${theme === 'dark' ? 'bg-primary-900' : 'bg-primary-900'}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Notre Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Découvrez nos derniers articles sur l'innovation, la technologie et
            l'apprentissage
          </motion.p>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <div
                className={`text-6xl mb-6 ${theme === "dark" ? "text-gray-600" : "text-gray-300"}`}
              >
                📝
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                Aucun blog disponible
              </h3>
              <p
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Les articles de blog seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  variants={itemVariants}
                  className={`group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-750"
                      : "bg-white hover:shadow-2xl"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(blog.cover)}
                      alt={blog.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Calendar
                        className={`h-4 w-4 mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      />
                      <span
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString("fr-FR")
                          : "Date non disponible"}
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {blog.title}
                    </h3>

                    {blog.description && (
                      <div
                        className={`text-sm mb-4 line-clamp-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                        dangerouslySetInnerHTML={{
                          __html: blog.description.slice(0, 150) + "...",
                        }}
                      />
                    )}

                    <Link
                      to={routes.blog(getEntitySlug(blog))}
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300"
                    >
                      Lire la suite
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
