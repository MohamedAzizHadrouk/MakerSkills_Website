import ApiService from "../../../../shared/apiClient";
import { Product } from "../../products";
import {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  AddCategoriesDto,
  UpdateStatusDto,
  ServiceFilters,
  Category,
  Event,
  Project,
} from "../types/service";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class ServiceService {
  // Récupérer tous les services avec filtres optionnels
  static async getAll(filters?: ServiceFilters): Promise<Service[]> {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.active !== undefined)
      params.append("active", filters.active.toString());
    if (filters?.search) params.append("search", filters.search);

    const response = await ApiService.get<{ message: string; data: Service[] }>(
      `/services?${params.toString()}`
    );
    return response.data;
  }

  // Récupérer un service par ID
  static async getById(id: string): Promise<Service> {
    const response = await ApiService.get<{ message: string; data: Service }>(
      `/services/${id}`
    );
    return response.data;
  }

  // Créer un nouveau service
  static async create(
    serviceData: CreateServiceDto,
    imageFile?: File
  ): Promise<Service> {
    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du service
    Object.keys(serviceData).forEach((key) => {
      const value = serviceData[key as keyof CreateServiceDto];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((item) => formData.append(key, item));
        }
        // Si le tableau est vide, on n'envoie rien
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement car ApiService utilise JSON
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Mettre à jour un service
  static async update(
    id: string,
    serviceData: UpdateServiceDto,
    imageFile?: File
  ): Promise<Service> {
    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du service
    Object.keys(serviceData).forEach((key) => {
      const value = serviceData[key as keyof UpdateServiceDto];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach((item) => formData.append(key, item));
        }
        // Si le tableau est vide, on n'envoie rien
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Supprimer un service
  static async delete(id: string): Promise<void> {
    await ApiService.delete(`/services/${id}`);
  }

  // Ajouter des catégories à un service
  static async addCategories(
    id: string,
    categories: string[]
  ): Promise<Service> {
    const response = await ApiService.post<{ message: string; data: Service }>(
      `/services/${id}/categories`,
      {
        categories,
      }
    );
    return response.data;
  }

  // Supprimer une catégorie d'un service
  static async removeCategory(id: string, categoryId: string): Promise<void> {
    await ApiService.delete(`/services/${id}/categories/${categoryId}`);
  }

  // Mettre à jour le statut d'un service
  static async updateStatus(id: string, isActive: boolean): Promise<Service> {
    const response = await ApiService.patch<{ message: string; data: Service }>(
      `/services/${id}/status`,
      {
        isActive,
      }
    );
    return response.data;
  }

  // Récupérer les services liés
  static async getRelatedServices(id: string): Promise<Service[]> {
    const response = await ApiService.get<{ message: string; data: Service[] }>(
      `/services/${id}/related`
    );
    return response.data;
  }

  // Récupérer toutes les catégories (pour les formulaires)
  static async getCategories(): Promise<Category[]> {
    const response = await ApiService.get<{
      message: string;
      data: Category[];
    }>("/categories");
    return response.data;
  }

  // Actions en lot
  static async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  static async bulkUpdateStatus(
    ids: string[],
    isActive: boolean
  ): Promise<void> {
    await Promise.all(ids.map((id) => this.updateStatus(id, isActive)));
  }

  // Récupérer tous les events
  static async getEvents(): Promise<Event[]> {
    const response = await ApiService.get<{ message: string; data: Event[] }>(
      "/events"
    );
    return response.data;
  }

  // Récupérer tous les projects
  static async getProjects(): Promise<Project[]> {
    const response = await ApiService.get<{ message: string; data: Project[] }>(
      "/projects"
    );
    return response.data;
  }

  // Récupérer tous les products
  static async getProducts(): Promise<Product[]> {
    const response = await ApiService.get<{ message: string; data: Product[] }>(
      "/products"
    );
    return response.data;
  }
}

export default ServiceService;
