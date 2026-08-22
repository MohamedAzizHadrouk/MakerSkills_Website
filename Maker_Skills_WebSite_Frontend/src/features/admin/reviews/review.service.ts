import { Review, CreateReviewDto, UpdateReviewDto } from "./review";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class ReviewService {
  static async getAll(): Promise<Review[]> {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async getById(id: string): Promise<Review> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async create(
    review: CreateReviewDto,
    imageFile?: File
  ): Promise<Review> {
    const formData = new FormData();
    Object.entries(review).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, value as string);
    });
    if (imageFile) formData.append("image", imageFile);
    const res = await fetch(`${API_BASE_URL}/reviews`, {
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
    review: UpdateReviewDto,
    imageFile?: File
  ): Promise<Review> {
    const formData = new FormData();
    Object.entries(review).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, value as string);
    });
    if (imageFile) formData.append("image", imageFile);
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
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
    await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  }
}

export default ReviewService;
