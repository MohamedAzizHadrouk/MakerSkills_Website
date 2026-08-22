import {
  HeroSection,
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
} from "./hero-section";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class HeroSectionService {
  static async getAll(): Promise<HeroSection[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/hero-section`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des sections:", error);
      return [];
    }
  }

  static async getById(id: string): Promise<HeroSection> {
    try {
      const res = await fetch(`${API_BASE_URL}/hero-section/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la section:", error);
      throw error;
    }
  }

  static async create(
    hero: CreateHeroSectionDto,
    imageFile?: File
  ): Promise<HeroSection> {
    try {
      const formData = new FormData();
      formData.append("type", hero.type);
      formData.append("title", hero.title);
      formData.append("subtitle", hero.subtitle);
      formData.append("description", hero.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (hero.buttons && Array.isArray(hero.buttons)) {
        formData.append("buttons", JSON.stringify(hero.buttons));
      }

      const res = await fetch(`${API_BASE_URL}/hero-section`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Erreur lors de la création de la section:", error);
      throw error;
    }
  }

  static async update(
    id: string,
    hero: UpdateHeroSectionDto,
    imageFile?: File
  ): Promise<HeroSection> {
    try {
      const formData = new FormData();
      if (hero.type) formData.append("type", hero.type);
      if (hero.title) formData.append("title", hero.title);
      if (hero.subtitle) formData.append("subtitle", hero.subtitle);
      if (hero.description) formData.append("description", hero.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (hero.buttons && Array.isArray(hero.buttons)) {
        formData.append("buttons", JSON.stringify(hero.buttons));
      }

      const res = await fetch(`${API_BASE_URL}/hero-section/${id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la section:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/hero-section/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la section:", error);
      throw error;
    }
  }
}

export default HeroSectionService;
