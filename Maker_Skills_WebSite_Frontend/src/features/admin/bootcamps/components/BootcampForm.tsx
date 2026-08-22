import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RichTextEditor from "../../../../shared/components/RichTextEditor";
import MediaUpload from "../../../../shared/components/MediaUpload";

import BootcampFields from "./BootcampFields";

import { productService } from "../../products";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../../../shared/uploadService";
type EventType = "workshop" | "bootcamp" | "event" | "course";

interface BaseFormProps {
  theme: "light" | "dark";
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  editingBootcamp?: any;
}

// Helper function to transform database fields to form fields
const transformBootcampForForm = (bootcamp: any) => {
  if (!bootcamp) return {};
  console.log("editing data:", bootcamp);
  return {
    ...bootcamp,
    // Map database field names to form field names
    startDate: bootcamp.dateDebut ? new Date(bootcamp.dateDebut) : undefined,
    duration: parseInt(bootcamp.duration) || "",
    instructor: bootcamp.animator
      ? {
          photoUrl:
            "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
          name: bootcamp.animator,
          title: "",
          experienceYears: 0,
          studentsCount: 0,
        }
      : {
          photoUrl:
            "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
          name: "",
          title: "",
          experienceYears: 0,
          studentsCount: 0,
        },
    // Handle category - extract ID if it's an object
    category: bootcamp.category?._id || bootcamp.category || "",
  };
};

// Helper function to transform form data back to API format
const transformFormDataForAPI = (formData: any) => {
  return {
    ...formData,
    // Map form field names back to database field names
    dateDebut: formData.startDate,
    periode: formData.duration,
    animator: formData.instructor?.name || "",
    // Remove the form-specific fields that shouldn't be sent to API
    startDate: undefined,
    duration: undefined,
    instructor: undefined,
    price: formData.price ? parseInt(formData.price) : null,
    reduction : formData.reduction ? parseInt(formData.reduction) : null,
  };
};

const EventForm: React.FC<BaseFormProps> = ({
  theme,
  loading,
  onSubmit,
  onCancel,
  imageFiles,
  setImageFiles,
  editingEvent,
}) => {
  const [eventType, setEventType] = useState<EventType>(
    editingEvent?.type || "bootcamp"
  );
  const [products, setProducts] = useState<any[]>([]);

  let [mainImage,setMainImage] = useState<string[] | null>(editingEvent?.coverImage ?[import.meta.env.VITE_API_URL + "/" + editingEvent?.coverImage] : null);
  // Transform the editing event data to match form expectations
  const [formData, setFormData] = useState<Partial<any>>(() => {
    const transformedData = transformBootcampForForm(editingEvent);
    return {
      modules: [{ title: "", items: [] }],
      ...transformedData,
      type: editingEvent?.type || "bootcamp",
    };
  });

  console.log(editingEvent);
  console.log("Transformed form data:", formData);

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    setFormData({ ...formData, type });
  };

  const handleCommonFieldChange = (field: keyof any, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const fetchProducts = async () => {
    try {
      let response = await productService.getProducts();
      setProducts(response);
    } catch (error) {
      console.log("error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Final formData:", formData);

    // Handle image upload only if new image is provided
    if (imageFiles[0]) {
      let responseImage = await uploadFile(
        import.meta.env.VITE_API_URL + "/upload",
        imageFiles[0],
        "file",
        { path: "events" }
      );
      formData.coverImage = responseImage.data.path;
    } else if (!editingEvent && !imageFiles[0]) {
      alert("Veillez ajouter une image de couverture!");
      return;
    }

    // Transform form data back to API format
    const apiData = transformFormDataForAPI(formData); 
    if(!apiData?.category){
      alert("Veillez choisir une catégorie!");
      return;
    }
    try {
      let response;
      if (editingEvent) {
        // Update existing event
        response = await axios.patch(
          import.meta.env.VITE_API_URL + "/events/" + editingEvent._id,
          apiData
        );
      } else {
        // Create new event
        response = await axios.post(
          import.meta.env.VITE_API_URL + "/events",
          apiData
        );
      }

      if (response?.status === 201 || response?.status === 200) {
        onCancel();
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Erreur lors de l'enregistrement de l'événement");
    }

    onSubmit(e); // optional if you still want to notify parent
  };

  return (
    <div className="space-y-8">
      {/* ... (même en-tête que précédemment) ... */}
      <form onSubmit={handleFormSubmit}>
        <div
          className={`p-8 rounded-2xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-lg space-y-6`}
        >
          {/* Sélection du type d'événement */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Type d'événement *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(["bootcamp", "workshop", "event", "course"] as EventType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`px-4 py-3 rounded-lg border transition-colors ${
                      eventType === type
                        ? "bg-orange-500 text-white border-orange-500"
                        : theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {type === "bootcamp" && "Bootcamp"}
                    {type === "workshop" && "Atelier"}
                    {type === "event" && "Événement"}
                    {type === "course" && "Formation"}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Champs spécifiques au type */}
          <BootcampFields
            products={products}
            formData={formData}
            setFormData={setFormData}
            theme={theme}
          />

          {/* Description (commune) */} 
          {/* Media Upload */}
          <MediaUpload
            images={imageFiles}
            setImages={setImageFiles}
            existingImages={mainImage || []}
            onRemoveExistingImage={(index) => {
              const newImages = [...(formData.galleryImages || [])];
              newImages.splice(index, 1);
              setMainImage(null)
              handleCommonFieldChange("galleryImages", newImages);
            }}
            label="Images de l'événement"
          />

          {/* Boutons de soumission */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Annuler
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? "Enregistrement..."
                : editingEvent
                ? "Modifier"
                : "Créer"}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
