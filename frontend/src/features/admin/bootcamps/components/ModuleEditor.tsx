import React, { useState } from "react";
import { Undo, X } from "lucide-react";

interface Module {
  title: string;
  items: string[];
}

interface ModuleEditorProps {
  module: Module;
  onChange: (updated: Module) => void;
  theme?: "light" | "dark";
  index: number;
  onRemove: () => void;
}

const ModuleEditorWith: React.FC<ModuleEditorProps> = ({
  module,
  onChange,
  theme = "light",
  onRemove,
  index,
}) => {
  const [rawItems, setRawItems] = useState(module.items.join("\n"));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...module, title: e.target.value });
  };

  const handleItemsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawItems(text);

    const split = text
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onChange({ ...module, items: split });
  };

  const clearModule = () => {
    setRawItems("");
    onChange({ title: "", items: [] });
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:space-x-6">
      {/* LEFT: Form */}
      <div className="flex-1 w-full space-y-4 p-4 border rounded-lg">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Titre du module
          </label>
          <input
            type="text"
            value={module.title}
            onChange={handleTitleChange}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder="Ex: Introduction à l'IoT"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Éléments (séparés par des virgules ou des lignes)
          </label>
          <textarea
            rows={6}
            value={rawItems}
            onChange={handleItemsChange}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
            placeholder={`Ex:\nConcepts fondamentaux\nArchitecture IoT\nProtocoles de communication`}
          />
        </div>

        <div className="flex justify-between space-x-2">
          <button
            type="button"
            onClick={clearModule}
            className="inline-flex items-center space-x-1 text-sm text-red-500 hover:text-red-700"
          >
            <Undo className="w-4 h-4" />
            <span>Réinitialiser le module</span>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center space-x-1 text-sm text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
            <span>Supprimer le module</span>
          </button>
        </div>
      </div>

      {module.title && module.items.length > 0 && (
        <div className="flex-1 w-full p-4 border rounded-lg mt-4 md:mt-0">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {module.title}
              </h3>
              <ul className="space-y-1">
                {module.items.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-check-circle h-4 w-4 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleEditorWith;
