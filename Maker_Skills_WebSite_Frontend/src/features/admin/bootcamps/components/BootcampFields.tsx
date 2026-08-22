import React, { useEffect, useState } from "react";
import { CreateBootcampDto } from "../types/bootcamp";
import ItemList from "./ItemList";
import { X } from "lucide-react";
import ModuleEditor from "./ModuleEditor";
import Select from "react-select";
import InstructorEditor from "./InstructorEditor";
import axios from "axios";
import RichTextEditor from "../../../../shared/components/RichTextEditor";

interface BootcampFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  theme: "light" | "dark";
  products: any[];
}

const BootcampFields: React.FC<BootcampFieldsProps> = ({
  formData,
  setFormData,
  theme,
  products,
}) => {
  const handleArrayChange = (field: keyof CreateBootcampDto, value: string) => {
    setFormData({
      ...formData,
      [field]: value.split(",").map((item) => item.trim()),
    });
  };
  const [showPreview, setShowPreview] = useState(false);

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/categories?type=event")
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.log("error feching categories", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nom */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Nom du bootcamp *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>

      {/* Prix */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Prix (DT)
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>

      {/* Réduction */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Réduction (%)
        </label>
        <input
          type="number"
          value={formData.reduction || ""}
          onChange={(e) =>
            setFormData({ ...formData, reduction: Number(e.target.value) })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          min="0"
          max="100"
        />
      </div>

      {/* Durée */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Durée (Jours)
        </label>
        <input
          type="number"
          min={1}
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          placeholder="Ex: 3 jours, 6 jours..."
        />
      </div>

      {/* Date de début */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Date de début
        </label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={
            formData.startDate
              ? formData.startDate.toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, startDate: new Date(e.target.value) })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        />
      </div>

      {/* Localisation */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Localisation *
        </label>
        <select
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="online">En ligne</option>
          <option value="in_person">En présentiel</option>
          <option value="hybrid">Hybride</option>
        </select>
      </div>
      {formData?.location === "in_person" && (
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Addresse
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
          />
        </div>
      )}
      {/* Certification */}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Certification
        </label>
        <select
          value={formData.certification ? "true" : "false"}
          onChange={(e) =>
            setFormData({
              ...formData,
              certification: e.target.value === "true",
            })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Catégorie
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
        >
          <option  disabled selected>
            Choisir une catégorie
          </option>
          {categories.map((category: any) => (
            <option key={category?._id} value={category?._id}>
              {category?.name}
            </option>
          ))}
        </select>
      </div>
      {/* Prérequis */}
      <div className="md:col-span-2">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Prérequis (séparés par des virgules)
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.required?.join(", ") || ""}
            onChange={(e) => handleArrayChange("required", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Ex: HTML, CSS, JavaScript..."
          />
          <button
            type="button"
            className="absolute top-2 right-0 p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setFormData({ ...formData, required: [] })}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div>
        <ItemList title="Prérequis" items={formData.required || []} />
      </div>
      {/* Ce qui est inclus */}
      <div className="md:col-span-2">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Ce qui est inclus (séparés par des virgules)
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.includedInEvent?.join(", ") || ""}
            onChange={(e) =>
              handleArrayChange("includedInEvent", e.target.value)
            }
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Ex: Support de cours, Accès communautaire..."
          />
          <button
            type="button"
            className="absolute top-2 right-0 p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setFormData({ ...formData, includedInEvent: [] })}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <ItemList
          title="Ce qui est inclus"
          items={formData.includedInEvent || []}
        />
      </div>
      <div className="md:col-span-2">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Objectifs (séparés par des virgules)
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.objectives?.join(", ") || ""}
            onChange={(e) => handleArrayChange("objectives", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Ex: Maîtriser les bases du HTML et du CSS, Concevoir des interfaces utilisateur..."
          />
          <button
            type="button"
            className="absolute top-2 right-0 p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setFormData({ ...formData, objectives: [] })}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ItemList title="Objectifs" items={formData.objectives || []} />
      <div className="mb-6">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Programme
        </label>

        <div className="inline-flex items-center p-1 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors duration-300">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !showPreview
                ? "bg-orange-500 text-white shadow"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Programme détaillé
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              showPreview
                ? "bg-orange-500 text-white shadow"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Sans programme
          </button>
        </div>
      </div>

      {!showPreview && (
        // EDIT MODE
        <div className="w-full relative md:col-span-2">
          <div className="relative w-full space-y-6">
            {formData?.modules?.map((mod, idx) => (
              <ModuleEditor
                key={idx}
                index={idx}
                module={mod}
                onRemove={() => {
                  if (idx === 0) return;
                  const copy = [...formData.modules];
                  copy.splice(idx, 1);
                  setFormData({ ...formData, modules: copy });
                }}
                onChange={(updated) => {
                  const copy = [...formData.modules];
                  copy[idx] = updated;
                  setFormData({ ...formData, modules: copy });
                }}
                theme={theme}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  modules: [...formData.modules, { title: "", items: [] }],
                })
              }
              className="w-full px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
            >
              Ajouter un module
            </button>
          </div>
        </div>
      )}
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Produits associés
        </label>
        <Select
          isMulti
          name="products"
          options={productOptions}
          value={productOptions.filter((option) =>
            formData.products?.includes(option.value)
          )}
          onChange={(selected) => {
            setFormData({
              ...formData,
              products: selected.map((option) => option.value),
            });
          }}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Sélectionner des produits associés..."
          noOptionsMessage={() => "Aucune option disponible"}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: theme === "dark" ? "#374151" : "white",
              borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
              color: theme === "dark" ? "white" : "black",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: theme === "dark" ? "#374151" : "white",
            }),
            option: (base) => ({
              ...base,
              backgroundColor: theme === "dark" ? "#374151" : "white",
              color: theme === "dark" ? "white" : "black",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#4B5563" : "#F3F4F6",
              },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: theme === "dark" ? "white" : "black",
            }),
          }}
        />
      </div>
      <div className="md:col-span-2">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Formateur
        </label>
        <InstructorEditor
          instructor={formData.instructor}
          onChange={(updated) =>
            setFormData({ ...formData, instructor: updated })
          }
        />
      </div>
      <div className="md:col-span-2">
        <label
          className={`block text-sm font-medium mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Description
        </label>
        <RichTextEditor
          value={formData.description || ""}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Décrivez votre événement..."
          className="w-full"
        />
      </div>
    </div>
  );
};

export default BootcampFields;
