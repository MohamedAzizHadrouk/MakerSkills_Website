export interface Laboratory {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  coverImagePath?: string;
  hourlyRate: number;
  materials?: Material[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  _id: string;
  name: string;
  description?: string;
  type: string;
  hourlyRate?: number;
  isFree: boolean;
  status: 'available' | 'unavailable' | 'maintenance';
  coverImagePath?: string;
  imageUrl?: string;
  laboratoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLaboratoryDto {
  title: string;
  description?: string;
  imageUrl?: string;
  coverImagePath?: string;
  hourlyRate: number;
}

export interface UpdateLaboratoryDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  coverImagePath?: string;
  hourlyRate?: number;
}

export interface CreateMaterialDto {
  name: string;
  description?: string;
  type: string;
  hourlyRate?: number;
  isFree: boolean;
  status: 'available' | 'unavailable' | 'maintenance';
  coverImagePath?: string;
  imageUrl?: string;
  laboratoryId: string;
}

export interface UpdateMaterialDto {
  name?: string;
  description?: string;
  type?: string;
  hourlyRate?: number;
  isFree?: boolean;
  status?: 'available' | 'unavailable' | 'maintenance';
  coverImagePath?: string;
  imageUrl?: string;
}

export interface LaboratoryFilters {
  search?: string;
  minRate?: number;
  maxRate?: number;
}

export interface LaboratoryFormData {
  title: string;
  description: string;
  imageUrl: string;
  hourlyRate: number;
}

export interface MaterialFormData {
  name: string;
  description: string;
  type: string;
  hourlyRate: number;
  isFree: boolean;
  status: 'available' | 'unavailable' | 'maintenance';
}

export interface LaboratoryCardProps {
  laboratory: Laboratory;
  onEdit: (laboratory: Laboratory) => void;
  onDelete: (id: string) => void;
  theme: "light" | "dark";
  onShowDetail?: (laboratory: Laboratory) => void;
}

export interface LaboratoryFormProps {
  theme: "light" | "dark";
  editingLaboratory: Laboratory | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: LaboratoryFormData;
  setFormData: (data: LaboratoryFormData) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
}

export interface LaboratoryFiltersProps {
  theme: "light" | "dark";
  filters: LaboratoryFilters;
  setFilters: (filters: LaboratoryFilters) => void;
  selectedLaboratories?: string[];
  laboratoriesCount?: number;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

export interface BulkActionsProps {
  theme: "light" | "dark";
  selectedLaboratories: string[];
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  theme: "light" | "dark";
}

export interface MaterialFormProps {
  theme: "light" | "dark";
  editingMaterial: Material | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: MaterialFormData;
  setFormData: (data: MaterialFormData) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  laboratoryId: string;
}

