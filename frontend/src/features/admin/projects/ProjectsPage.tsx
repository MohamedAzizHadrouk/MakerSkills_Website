import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "../../../stores/useStore";
import ProjectCard from "./components/ProjectCard";
import ProjectForm from "./components/ProjectForm";
import ConfirmDialog from "../../../shared/components/ConfirmDialog";
import { projectService } from "./services/project.service";
import { Project, CreateProjectDto } from "./types/project";

const ProjectsManagement = () => {
  const { theme } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  // Simplified form state to match DTO
  const [formData, setFormData] = useState<CreateProjectDto>({
    name: "",
    description: "",
    coverImage: "",
    technologies: [],
    categories: [],
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // CRUD operations
  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      coverImage: "",
      technologies: [],
      categories: [],
    });
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      coverImage: project.coverImage,
      technologies: project.technologies,
      categories: project.categories,
    });
    setShowForm(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete._id);
      setProjects(projects.filter((p) => p._id !== projectToDelete._id));
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await projectService.updateProject(
          editingProject._id,
          formData
        );
        setProjects(projects.map((p) => (p._id === updated._id ? updated : p)));
        setEditingProject(null);
      } else {
        if (!imageFile) {
          alert("Choisir une image avant de publier un projet");
        }
        const created = await projectService.createProject(formData, imageFile);
        setProjects([created, ...projects]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div className={theme === "dark" ? "bg-gray-900" : "bg-gray-50"}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Gestion des Projets
            </h1>
            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Vos projects actuels
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="bg-orange-500 text-white p-2 rounded-lg"
          >
            <Plus className="inline mr-2" />
            New Project
          </motion.button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                theme={theme}
              />
            ))}
          </div>
        )}

        {showForm && (
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            editingProject={editingProject}
            loading={loading}
            imageFile={imageFile}
            setImageFile={setImageFile}
          />
        )}

        <ConfirmDialog
          isOpen={confirmOpen}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
          title="Delete Project?"
          message="This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ProjectsManagement;
