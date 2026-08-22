import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../types/category";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

class CategoryService {
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

  async getCategories(type?: "event" | "product"): Promise<Category[]> {
    const response = await this.makeRequest<{
      message: string;
      data: Category[];
    }>("/categories" + (type ? `?type=${type}` : ""));
    return response.data;
  }

  async getCategory(id: string): Promise<Category> {
    const response = await this.makeRequest<{
      message: string;
      data: Category;
    }>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const response = await this.makeRequest<{
      message: string;
      data: Category;
    }>("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await this.makeRequest<{
      message: string;
      data: Category;
    }>(`/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.makeRequest(`/categories/${id}`, {
      method: "DELETE",
    });
  }
}

export const categoryService = new CategoryService();
