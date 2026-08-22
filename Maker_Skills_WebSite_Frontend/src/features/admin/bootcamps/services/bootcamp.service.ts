import {
  Bootcamp,
  CreateBootcampDto,
  UpdateBootcampDto,
} from "../types/bootcamp";
import { categoryService } from "../../categories/services/category.service";
import { productService } from "../../products/services/product.service";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

class BootcampService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getBootcamps(): Promise<Bootcamp[]> {
    const response = await this.makeRequest<{
      message: string;
      data: Bootcamp[];
    }>("/bootcamps");
    return response.data;
  }

  async getBootcamp(id: string): Promise<Bootcamp> {
    const response = await this.makeRequest<{
      message: string;
      data: Bootcamp;
    }>(`/events/${id}`);
    return response.data;
  }

  async createBootcamp(
    data: CreateBootcampDto,
    imageFiles?: File[]
  ): Promise<Bootcamp> {
    const formData = new FormData();

    // Ajouter les données du bootcamp
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("category", data.category);

    // Gérer les types correctement (éviter le double JSON.stringify)
    if (data.types && data.types.length > 0) {
      data.types.forEach((type) => {
        formData.append("types", type);
      });
    }

    formData.append("dateDebut", data.dateDebut);
    formData.append("dateFin", data.dateFin);
    formData.append("periode", data.periode || "");
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("animator", data.animator);

    // Gérer les produits correctement
    if (data.products && data.products.length > 0) {
      data.products.forEach((productId) => {
        formData.append("products", productId);
      });
    }

    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await this.makeRequest<{
      message: string;
      data: Bootcamp;
    }>(`/bootcamps`, {
      method: "POST",
      body: formData,
    });
    return response.data;
  }

  async updateBootcamp(
    id: string,
    data: UpdateBootcampDto,
    imageFiles?: File[]
  ): Promise<Bootcamp> {
    const formData = new FormData();

    // Ajouter les données du bootcamp
    if (data.name) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);

    // Gérer les types correctement
    if (data.types && data.types.length > 0) {
      data.types.forEach((type) => {
        formData.append("types", type);
      });
    }

    if (data.dateDebut) formData.append("dateDebut", data.dateDebut);
    if (data.dateFin) formData.append("dateFin", data.dateFin);
    if (data.periode !== undefined) formData.append("periode", data.periode);
    if (data.location) formData.append("location", data.location);
    if (data.price) formData.append("price", data.price);
    if (data.animator) formData.append("animator", data.animator);

    // Gérer les produits correctement
    if (data.products && data.products.length > 0) {
      data.products.forEach((productId) => {
        formData.append("products", productId);
      });
    }

    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await this.makeRequest<{
      message: string;
      data: Bootcamp;
    }>(`/bootcamps/${id}`, {
      method: "PATCH",
      body: formData,
    });
    return response.data;
  }

  async deleteBootcamp(id: string): Promise<void> {
    await this.makeRequest(`/events/${id}`, {
      method: "DELETE",
    });
  }

  // Méthodes pour récupérer les données de référence
  async getCategories() {
    return categoryService.getCategories();
  }

  async getProducts() {
    return productService.getProducts();
  }
}

export const bootcampService = new BootcampService();
