import { Product, CreateProductDto, UpdateProductDto } from "../types/product";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

class ProductService {
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

  async getProducts(): Promise<Product[]> {
    const response = await this.makeRequest<{
      message: string;
      data: Product[];
    }>("/products");
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.makeRequest<{ message: string; data: Product }>(
      `/products/${id}`
    );
    return response.data;
  }

  async createProduct(
    data: CreateProductDto,
    imageFiles?: File[],
    videoFile?: File
  ): Promise<Product> {
    // Si une vidéo est fournie, l'uploader d'abord
    let videoPath: string | undefined;
    if (videoFile) {
      const videoResponse = await this.uploadVideo(videoFile);
      videoPath = videoResponse.videoPath;
    }

    const formData = new FormData();

    // Ajouter les données du produit
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString());
    formData.append("category", data.category);

    // Ajouter les events liés
    if (data.events && data.events.length > 0) {
      formData.append("events", JSON.stringify(data.events));
    } else {
      // Envoyer un tableau vide si aucun event
      formData.append("events", JSON.stringify([]));
    }

    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Ajouter le chemin de la vidéo uploadée
    if (videoPath) {
      formData.append("video", videoPath);
    }

    const response = await this.makeRequest<{ message: string; data: Product }>(
      "/products",
      {
        method: "POST",
        body: formData,
      }
    );
    return response.data;
  }

  async updateProduct(
    id: string,
    data: UpdateProductDto,
    imageFiles?: File[],
    videoFile?: File
  ): Promise<Product> {
    // Si une nouvelle vidéo est fournie, l'uploader d'abord
    let videoPath: string | undefined;
    if (videoFile) {
      const videoResponse = await this.uploadVideo(videoFile);
      videoPath = videoResponse.videoPath;
    }

    const formData = new FormData();

    // Ajouter les données du produit
    if (data.name) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.category) formData.append("category", data.category);

    // Ajouter les events liés
    if (data.events && data.events.length > 0) {
      formData.append("events", JSON.stringify(data.events));
    } else {
      // Envoyer un tableau vide si aucun event
      formData.append("events", JSON.stringify([]));
    }

    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    // Ajouter le chemin de la vidéo uploadée
    if (videoPath) {
      formData.append("video", videoPath);
    }

    const response = await this.makeRequest<{ message: string; data: Product }>(
      `/products/${id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.makeRequest(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async uploadVideo(videoFile: File): Promise<{ videoPath: string }> {
    const formData = new FormData();
    formData.append("video", videoFile);

    const response = await this.makeRequest<{
      message: string;
      videoPath: string;
    }>("/products/upload-video", {
      method: "POST",
      body: formData,
    });
    return { videoPath: response.videoPath };
  }
}

export const productService = new ProductService();
