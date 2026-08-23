import React, { useState } from "react";
import { Pencil, Trash, X } from "lucide-react";
import { motion } from "framer-motion";
import { Project } from "../types/project";
import { getImageUrl } from "../../../../shared/utils/imageUtils";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  theme: "light" | "dark";
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  theme,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className={`rounded-2xl overflow-hidden shadow-lg flex flex-col h-full transition-colors duration-300 cursor-pointer ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
        onClick={openModal}
      >
        {project.coverImage && (
          <img
            src={getImageUrl(project.coverImage)}
            alt={project.name}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="flex-1 p-6 space-y-4">
          <h3
            className={`text-xl font-semibold truncate ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {project.name}
          </h3>
          {project.description && (
            <p
              className={`text-sm line-clamp-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {project.description}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-100 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-2 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <Trash className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 p-1 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <div className="flex space-x-2 mt-5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                      closeModal();
                    }}
                    className="p-2 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project);
                      closeModal();
                    }}
                    className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <Trash className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              {project.coverImage && (
                <img
                  src={getImageUrl(project.coverImage)}
                  alt={project.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-sm">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.length > 0 ? (
                      project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 rounded-full text-xs ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm">No technologies listed</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.categories?.length > 0 ? (
                      project.categories.map((category, _) => (
                        <span
                          key={_}
                          className={`px-3 py-1 rounded-full text-xs ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {category?.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm">No categories listed</p>
                    )}
                  </div>
                </div>

                {(project.createdAt || project.updatedAt) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {project.createdAt && (
                      <p>
                        Created: {new Date(project.createdAt).toLocaleString()}
                      </p>
                    )}
                    {project.updatedAt && (
                      <p>
                        Updated: {new Date(project.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
