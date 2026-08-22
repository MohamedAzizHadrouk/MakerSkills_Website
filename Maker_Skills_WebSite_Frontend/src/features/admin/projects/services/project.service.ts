import axios from "axios";
import { Project, CreateProjectDto, UpdateProjectDto } from "../types/project";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

class ProjectService {
  private async request<T>(
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

  async getProjects(): Promise<Project[]> {
    const res = await this.request<{ message: string; data: Project[] }>(
      "/projects"
    );
    return res.data;
  }

  async getProject(id: string): Promise<Project> {
    const res = await this.request<{ message: string; data: Project }>(
      `/projects/${id}`
    );
    return res.data;
  }

  async createProject(
    data: CreateProjectDto,
    imageFile: File
  ): Promise<Project> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("technologies", JSON.stringify(data.technologies));
    formData.append("categories", JSON.stringify(data.categories));

    // Append the actual file, not the string path
    formData.append("coverImage", imageFile);

    const res = await this.request<{ message: string; data: Project }>(
      "/projects",
      {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - the browser will set it with the correct boundary
      }
    );
    return res.data;
  }

  async updateProject(id: string, data: UpdateProjectDto): Promise<Project> {
    data.technologies = JSON.stringify(data.technologies);
    data.categories = JSON.stringify(data.categories);
    console.log("data =>", data);
    const response = await this.request<{ message: string; data: Project }>(
      `/projects/${id}`,
      {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json', // Add this
        },
        body: JSON.stringify(data),
      }
    );
    console.log("response =>", response);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: "DELETE" });
  }
}

export const projectService = new ProjectService();
