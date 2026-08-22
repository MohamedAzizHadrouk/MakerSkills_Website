import { Partner, CreatePartnerDto, UpdatePartnerDto } from "./partner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export class PartnerService {
  static async getAll(): Promise<Partner[]> {
    const res = await fetch(`${API_BASE_URL}/partners`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async getById(id: string): Promise<Partner> {
    const res = await fetch(`${API_BASE_URL}/partners/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    const data = await res.json();
    return data.data;
  }

  static async create(
    partner: CreatePartnerDto,
    logoFile?: File
  ): Promise<Partner> {
    const formData = new FormData();
    Object.entries(partner).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, value as string);
    });
    if (logoFile) formData.append("logo", logoFile);
    const res = await fetch(`${API_BASE_URL}/partners`, {
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
    partner: UpdatePartnerDto,
    logoFile?: File
  ): Promise<Partner> {
    const formData = new FormData();
    Object.entries(partner).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, value as string);
    });
    if (logoFile) formData.append("logo", logoFile);
    const res = await fetch(`${API_BASE_URL}/partners/${id}`, {
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
    await fetch(`${API_BASE_URL}/partners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  }
}

export default PartnerService;
