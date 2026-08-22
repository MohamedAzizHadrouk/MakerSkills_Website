import { Blog, CreateBlogDto, UpdateBlogDto } from "./blog";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class BlogService {
  static async getAll(): Promise<Blog[]> {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async getById(id: string): Promise<Blog> {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async create(
    blog: CreateBlogDto,
    coverFile: File,
    imageFiles?: File[]
  ): Promise<Blog> {
    const formData = new FormData();
    formData.append("title", blog.title);
    if (coverFile) formData.append("cover", coverFile);
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    }
    if (blog.description) formData.append("description", blog.description);
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async update(
    id: string,
    blog: UpdateBlogDto,
    coverFile?: File,
    imageFiles?: File[]
  ): Promise<Blog> {
    const formData = new FormData();
    if (blog.title) formData.append("title", blog.title);
    if (coverFile) formData.append("cover", coverFile);
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    }
    if (blog.description) formData.append("description", blog.description);
    const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async delete(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  }
}

export default BlogService;
