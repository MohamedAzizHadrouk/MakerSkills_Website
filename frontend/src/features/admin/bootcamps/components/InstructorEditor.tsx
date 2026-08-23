import React from "react";
import { User, Users } from "lucide-react";

interface Instructor {
  photoUrl: string;
  name: string;
  title: string;
  experienceYears: number;
  studentsCount: number;
}

interface InstructorEditorProps {
  instructor: Instructor;
  onChange: (updated: Instructor) => void;
}

const InstructorEditor: React.FC<InstructorEditorProps> = ({
  instructor,
  onChange,
}) => {
  const handleChange = (field: keyof Instructor, value: any) => {
    onChange({ ...instructor, [field]: value });
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:space-x-6">
      {/* LEFT: Editor */}
      <div className="flex-1 space-y-4 p-4 border rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Nom du formateur
          </label>
          <input
            type="text"
            value={instructor?.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300"
            placeholder="Ex: Dr. Ahmed Ben Ali"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Titre
          </label>
          <input
            type="text"
            value={instructor?.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300"
            placeholder="Ex: Expert IoT & Systèmes Embarqués"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            URL de la photo
          </label>
          <input
            type="text"
            value={instructor?.photoUrl}
            onChange={(e) => handleChange("photoUrl", e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Années d'expérience
            </label>
            <input
              type="number"
              min={0}
              value={instructor?.experienceYears}
              onChange={(e) =>
                handleChange("experienceYears", Number(e.target.value))
              }
              className="w-full px-4 py-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Étudiants formés
            </label>
            <input
              type="number"
              min={0}
              value={instructor?.studentsCount}
              onChange={(e) =>
                handleChange("studentsCount", Number(e.target.value))
              }
              className="w-full px-4 py-2 rounded border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* RIGHT: Preview */}
      <div className="flex-1 mt-4 md:mt-0 p-6 rounded-xl bg-gray-50 border">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Votre formateur
        </h3>
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={
              instructor?.photoUrl ||
              "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
            }
            alt={instructor?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{instructor?.name}</h4>
            <p className="text-sm text-gray-600">{instructor?.title}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600">
              {instructor?.experienceYears} ans d'expérience
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {instructor?.studentsCount}+ étudiants formés
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorEditor;
