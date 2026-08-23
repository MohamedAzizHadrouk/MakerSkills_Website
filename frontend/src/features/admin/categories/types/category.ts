export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: "product" | "event";
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  type: "product" | "event";
}
export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  type: "product" | "event";
}

export interface CategoryResponse {
  success: boolean;
  data?: Category | Category[];
  message?: string;
  error?: string;
}
