import { Product } from "../../products";

export interface Service {
  _id: string;
  name: string;
  description?: string;
  categories?: Category[];
  coverImagePath?: string;
  isActive?: boolean;
  events?: Event[];
  projects?: Project[];
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Event {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  categories: string[];
  coverImagePath?: string;
  isActive?: boolean;
  events?: string[];
  projects?: string[];
  products?: string[];
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  categories?: string[];
  coverImagePath?: string;
  isActive?: boolean;
  events?: string[];
  projects?: string[];
  products?: string[];
}

export interface AddCategoriesDto {
  categories: string[];
}

export interface UpdateStatusDto {
  isActive: boolean;
}

export interface ServiceFilters {
  category?: string;
  active?: boolean;
  search?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  categories: string[];
  isActive: boolean;
  events: string[];
  projects: string[];
  products: string[];
}

export interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  theme: "light" | "dark";
  onShowDetail?: (service: Service) => void;
}

export interface ServiceFormProps {
  theme: "light" | "dark";
  editingService: Service | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
}

export interface ServiceFiltersProps {
  theme: "light" | "dark";
  filters: ServiceFilters;
  setFilters: (filters: ServiceFilters) => void;
  categories: Category[];
}

export interface BulkActionsProps {
  theme: "light" | "dark";
  selectedServices: string[];
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onClearSelection: () => void;
}
