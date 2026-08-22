import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { useStore } from "../../../../stores/useStore";
import { ConfirmDialog } from "../../../../shared";
import { CreateBootcampDto, Bootcamp } from "../types/bootcamp";
import { bootcampService } from "../services/bootcamp.service";
import AnimatedSection from "../../../../components/UI/AnimatedSection";
import BootcampCard from "../components/BootcampCard";
import BootcampForm from "../components/BootcampForm";
import BootcampFilters from "../components/BootcampFilters";
import BootcampBulkActions from "../components/BootcampBulkActions";
import axios from "axios";

const BootcampsManagement: React.FC = () => {
  const { theme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
  const [selectedBootcamps, setSelectedBootcamps] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    isBulk: boolean;
  } | null>(null);
  const [formData, setFormData] = useState<CreateBootcampDto>({
    name: "",
    category: "",
    types: [],
    description: "",
    dateDebut: "",
    dateFin: "",
    periode: "",
    location: "",
    price: "",
    animator: "",
    products: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Fonction pour convertir une date ISO en format YYYY-MM-DD
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Charger les bootcamps
  const loadBootcamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/events");
      // Access the data array from the response
      const bootcampsData = res.data.data || [];  
      // Transform the data to match your expected structure
      const transformedBootcamps = bootcampsData.map((bootcamp: any) => ({
        _id: bootcamp._id,
        name: bootcamp.name || "",
        category: bootcamp.category || "", // You might need to adjust this
        types: bootcamp.types || [], // You might need to adjust this
        description: bootcamp.description || "", // Not in your sample data
        dateDebut: bootcamp.dateDebut || "",
        dateFin: bootcamp.endDate || "", // Not in your sample data
        periode: bootcamp.periode || "",
        duration:bootcamp.periode || "",
        location: bootcamp.location || "",
        address: bootcamp.address || "",
        price: bootcamp.price?.toString() || "0",
        reduction: bootcamp.reduction || "0", 
        animator: bootcamp.animator || "",
        products: bootcamp.products || [],
        // Add other fields as needed
        modules: bootcamp.modules || [],
        certification: bootcamp.certification || false,
        coverImage: bootcamp.coverImage || "",
        required:bootcamp.required || null , 
        includedInEvent:bootcamp.includedInEvent || null , 
        objectives:bootcamp.objectives || null , 
       /*  instructor: */
      }));

      setBootcamps(transformedBootcamps);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      setBootcamps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootcamps();
  }, []);

  // Gérer l'état de navigation depuis BootcampDetail
  useEffect(() => {
    if (location.state?.editBootcamp && location.state?.showForm) {
      const bootcampToEdit = location.state.editBootcamp as Bootcamp;
      setEditingBootcamp(bootcampToEdit);
      setFormData({
        name: bootcampToEdit.name,
        category:
          typeof bootcampToEdit.category === "string"
            ? bootcampToEdit.category
            : bootcampToEdit.category?._id || "",
        types: bootcampToEdit.types,
        description: bootcampToEdit.description || "",
        dateDebut: formatDateForInput(bootcampToEdit.dateDebut),
        dateFin: formatDateForInput(bootcampToEdit.dateFin),
        periode: bootcampToEdit.periode || "",
        location: bootcampToEdit.location,
        price: bootcampToEdit.price,
        animator: bootcampToEdit.animator,
        products:
          bootcampToEdit?.products?.map((p) =>
            typeof p === "string" ? p : p._id
          ) || [],
      });
      setImageFiles([]);
      setShowForm(true);

      // Nettoyer l'état de navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Filtrer les bootcamps
  const filteredBootcamps = (bootcamps || []).filter((bootcamp) => {
    const matchesSearch =
      bootcamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bootcamp.description &&
        bootcamp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      filterCategory === "all" ||
      (typeof bootcamp.category === "string"
        ? bootcamp.category
        : bootcamp.category?._id) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBootcamps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBootcamps = filteredBootcamps.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Gestion des actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {  
      if (editingBootcamp) {
      let obj:any = formData
      obj.price = obj.price ? parseInt(obj.price) : null
    //  await  axios.patch(import.meta.env.VITE_API_URL + `/events/${editingBootcamp._id}`, obj);
    }
      setShowForm(false);
      setEditingBootcamp(null);
      setFormData({
        name: "",
        category: "",
        types: [],
        description: "",
        dateDebut: "",
        dateFin: "",
        periode: "",
        location: "",
        price: "",
        animator: "",
        products: [],
      });
      setImageFiles([]);
      loadBootcamps();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bootcamp: any) => {
    console.log("bootcamp to edit", bootcamp);
    setEditingBootcamp(bootcamp);
    setFormData({
      name: bootcamp.name,
      category:
        typeof bootcamp.category === "string"
          ? bootcamp.category
          : bootcamp.category?._id || "",
      types: bootcamp.types,
      description: bootcamp.description || "",
      dateDebut: formatDateForInput(bootcamp.dateDebut),
      dateFin: formatDateForInput(bootcamp.dateFin),
      periode: bootcamp.periode || "",
      location: bootcamp.location,
      price: bootcamp.price,
      animator: bootcamp.animator,
      products:
        bootcamp.products?.map((p) => (typeof p === "string" ? p : p._id)) ||
        [],
    });
    setImageFiles([]);
    setShowForm(true);
  };
  const handleDelete = (id: string) => {
    setDeleteTarget({ id, isBulk: false });
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget({ id: "", isBulk: true });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.isBulk) {
        await Promise.all(
          selectedBootcamps.map((id) => bootcampService.deleteBootcamp(id))
        );
        setSelectedBootcamps([]);
      } else {
        await bootcampService.deleteBootcamp(deleteTarget.id);
      }
      loadBootcamps();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const handleSelectBootcamp = (id: string) => {
    setSelectedBootcamps((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return newSelection;
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBootcamp(null);
    setFormData({
      name: "",
      category: "",
      types: [],
      description: "",
      dateDebut: "",
      dateFin: "",
      periode: "",
      location: "",
      price: "",
      animator: "",
      products: [],
    });
    setImageFiles([]);
  };

  const handleViewBootcamp = (bootcampId: string) => {
    navigate(`/admin/bootcamps/${bootcampId}`);
  };

  // Afficher le formulaire si nécessaire
  if (showForm) {
    return (
      <BootcampForm
        theme={theme}
        editingEvent={editingBootcamp}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={handleCancelForm}
        formData={formData}
        setFormData={setFormData}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Gestion des Evenements
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gérez vos Evenements intensifs et programmes spécialisés
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nouvel événement </span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Error Display */}
        {error && (
          <AnimatedSection>
            <div
              className={`p-4 rounded-lg mb-8 ${
                theme === "dark"
                  ? "bg-red-900/20 border-red-800"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-red-300" : "text-red-700"
                }`}
              >
                {error}
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Bulk Actions */}
        <BootcampBulkActions
          theme={theme}
          selectedBootcamps={selectedBootcamps}
          onClearSelection={() => setSelectedBootcamps([])}
          onBulkDelete={handleBulkDelete}
        />

        {/* Filters */}
        <BootcampFilters
          theme={theme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        />

        {/* Bootcamps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {paginatedBootcamps.map((bootcamp, index) => (
            <AnimatedSection key={bootcamp._id} delay={index * 0.1}>
              <BootcampCard
                bootcamp={bootcamp}
                theme={theme}
                isSelected={selectedBootcamps.includes(bootcamp._id)}
                onSelect={handleSelectBootcamp}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleViewBootcamp}
              />
            </AnimatedSection>
          ))}
        </div>

        {!loading && paginatedBootcamps.length === 0 && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div
                className={`text-6xl mb-4 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                🚀
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Aucun bootcamp trouvé
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Essayez de modifier vos critères de recherche ou créez un
                nouveau bootcamp.
              </p>
            </div>
          </AnimatedSection>
        )}

        {/* Loading State */}
        {loading && (
          <AnimatedSection>
            <div
              className={`text-center py-12 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-orange-500 border-t-transparent rounded-full" />
              <p>Chargement des bootcamps...</p>
            </div>
          </AnimatedSection>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <AnimatedSection>
            <div
              className={`rounded-2xl overflow-hidden shadow-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between p-4">
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Page {currentPage} sur {totalPages} (
                  {filteredBootcamps.length} bootcamps)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title={
            deleteTarget?.isBulk
              ? "Supprimer les événements"
              : "Supprimer l'événement"
          }
          message={
            deleteTarget?.isBulk
              ? `Êtes-vous sûr de vouloir supprimer ${selectedBootcamps.length} événements(s) ?`
              : "Êtes-vous sûr de vouloir supprimer cet événement ?"
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
    </div>
  );
};

export default BootcampsManagement;
