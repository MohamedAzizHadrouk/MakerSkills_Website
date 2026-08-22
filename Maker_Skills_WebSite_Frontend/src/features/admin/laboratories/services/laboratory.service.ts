import ApiService from "../../../../shared/apiClient";
import {
  Laboratory,
  CreateLaboratoryDto,
  UpdateLaboratoryDto,
  LaboratoryFilters,
  Material,
  CreateMaterialDto,
  UpdateMaterialDto,
} from "../types/laboratory";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class LaboratoryService {
  // Récupérer tous les laboratoires avec filtres optionnels
  static async getAll(filters?: LaboratoryFilters): Promise<Laboratory[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.minRate) params.append("minRate", filters.minRate.toString());
    if (filters?.maxRate) params.append("maxRate", filters.maxRate.toString());

    const response = await ApiService.get<{ message: string; data: Laboratory[] }>(
      `/laboratories?${params.toString()}`
    );
    return response.data;
  }

  // Récupérer un laboratoire par ID
  static async getById(id: string): Promise<Laboratory> {
    const response = await ApiService.get<{ message: string; data: Laboratory }>(
      `/laboratories/${id}`
    );
    return response.data;
  }

  // Créer un nouveau laboratoire
  static async create(
    laboratoryData: CreateLaboratoryDto,
    imageFile?: File
  ): Promise<Laboratory> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du laboratoire
    Object.keys(laboratoryData).forEach((key) => {
      const value = laboratoryData[key as keyof CreateLaboratoryDto];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement car ApiService utilise JSON
    const response = await fetch(`${API_BASE_URL}/laboratories`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  }

  // Mettre à jour un laboratoire
  static async update(
    id: string,
    laboratoryData: UpdateLaboratoryDto,
    imageFile?: File
  ): Promise<Laboratory> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du laboratoire
    Object.keys(laboratoryData).forEach((key) => {
      const value = laboratoryData[key as keyof UpdateLaboratoryDto];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement
    const response = await fetch(`${API_BASE_URL}/laboratories/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  }

  // Supprimer un laboratoire
  static async delete(id: string): Promise<void> {
    await ApiService.delete(`/laboratories/${id}`);
  }

  // Actions en lot
  static async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  // ========== MATÉRIELS ==========

  // Récupérer tous les matériels d'un laboratoire
  static async getMaterials(laboratoryId: string): Promise<Material[]> {
    const response = await ApiService.get<{ message: string; data: Material[] }>(
      `/laboratories/${laboratoryId}/materials`
    );
    return response.data;
  }

  // Récupérer un matériel par ID
  static async getMaterialById(laboratoryId: string, materialId: string): Promise<Material> {
    const response = await ApiService.get<{ message: string; data: Material }>(
      `/laboratories/${laboratoryId}/materials/${materialId}`
    );
    return response.data;
  }

  // Créer un nouveau matériel
  static async createMaterial(
    laboratoryId: string,
    materialData: CreateMaterialDto,
    imageFile?: File
  ): Promise<Material> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du matériel
    Object.keys(materialData).forEach((key) => {
      const value = materialData[key as keyof CreateMaterialDto];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement car ApiService utilise JSON
    const response = await fetch(`${API_BASE_URL}/laboratories/${laboratoryId}/materials`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  }

  // Mettre à jour un matériel
  static async updateMaterial(
    laboratoryId: string,
    materialId: string,
    materialData: UpdateMaterialDto,
    imageFile?: File
  ): Promise<Material> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required. Please login first.");
    }

    const formData = new FormData();

    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Ajouter les données du matériel
    Object.keys(materialData).forEach((key) => {
      const value = materialData[key as keyof UpdateMaterialDto];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Pour FormData, on doit utiliser fetch directement
    const response = await fetch(`${API_BASE_URL}/laboratories/${laboratoryId}/materials/${materialId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  }

  // Supprimer un matériel
  static async deleteMaterial(laboratoryId: string, materialId: string): Promise<void> {
    await ApiService.delete(`/laboratories/${laboratoryId}/materials/${materialId}`);
  }

  // ========== RESERVATION METHODS ==========

  // Créer une réservation
  static async createReservation(
    laboratoryId: string,
    reservationData: CreateLaboratoryReservationDto
  ): Promise<LaboratoryReservation> {
    const response = await ApiService.post<{ message: string; data: LaboratoryReservation }>(
      `/laboratories/${laboratoryId}/reservations`,
      reservationData
    );
    return response.data;
  }

  // Récupérer toutes les réservations d'un laboratoire
  static async getReservations(laboratoryId: string): Promise<LaboratoryReservation[]> {
    const response = await ApiService.get<{ message: string; data: LaboratoryReservation[] }>(
      `/laboratories/${laboratoryId}/reservations`
    );
    return response.data;
  }

  // Récupérer toutes les réservations (admin)
  static async getAllReservations(): Promise<LaboratoryReservation[]> {
    const response = await ApiService.get<{ message: string; data: LaboratoryReservation[] }>(
      `/laboratories/reservations`
    );
    return response.data;
  }

  // Récupérer une réservation par ID
  static async getReservationById(reservationId: string): Promise<LaboratoryReservation> {
    const response = await ApiService.get<{ message: string; data: LaboratoryReservation }>(
      `/laboratories/reservations/${reservationId}`
    );
    return response.data;
  }

  // Mettre à jour une réservation
  static async updateReservation(
    reservationId: string,
    updateData: UpdateLaboratoryReservationDto
  ): Promise<LaboratoryReservation> {
    const response = await ApiService.patch<{ message: string; data: LaboratoryReservation }>(
      `/laboratories/reservations/${reservationId}`,
      updateData
    );
    return response.data;
  }

  // Supprimer une réservation
  static async deleteReservation(reservationId: string): Promise<void> {
    await ApiService.delete(`/laboratories/reservations/${reservationId}`);
  }

  // Récupérer le statut de la fonctionnalité laboratoires
  static async getFeatureStatus(): Promise<{ isEnabled: boolean; reason?: string; isEnabledPublic?: boolean; isEnabledAdmin?: boolean; reasonPublic?: string; reasonAdmin?: string }> {
    try {
      const response = await ApiService.get<{
        _id: string;
        identifier: string;
        isEnabled?: boolean; // Legacy field
        isEnabledPublic: boolean;
        isEnabledAdmin: boolean;
        reason?: string; // Legacy field
        reasonPublic?: string;
        reasonAdmin?: string;
        createdAt: string;
        updatedAt: string;
      }>('/laboratories/feature-status');
      return {
        isEnabled: response.isEnabled ?? response.isEnabledPublic, // Legacy field for backward compatibility
        reason: response.reason ?? response.reasonPublic, // Legacy field
        isEnabledPublic: response.isEnabledPublic,
        isEnabledAdmin: response.isEnabledAdmin,
        reasonPublic: response.reasonPublic,
        reasonAdmin: response.reasonAdmin,
      };
    } catch (error) {
      console.error('Error fetching feature status:', error);
      // En cas d'erreur, on suppose que c'est activé par défaut
      return { isEnabled: true, isEnabledPublic: true, isEnabledAdmin: true };
    }
  }
}

// Export types for reservations
export interface CreateLaboratoryReservationDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  materials?: string[];
  reservationDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateLaboratoryReservationDto {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalCost?: number;
  notes?: string;
}

export interface LaboratoryReservation {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  laboratoryId: string | Laboratory;
  materials: string[] | Material[];
  reservationDate: Date | string;
  startTime: string;
  endTime: string;
  notes?: string;
  totalCost?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default LaboratoryService;

