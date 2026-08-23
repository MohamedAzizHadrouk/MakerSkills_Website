import { API_BASE_URL } from "../apiBase";

export const getProductImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return "/placeholder-product.png";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const base = API_BASE_URL.replace(/\/$/, "");
  const path = imagePath.replace(/^\//, "");
  return base ? `${base}/${path}` : `/${path}`;
};

export const getImageUrl = (
  path?: string,
  baseUrl: string = API_BASE_URL
): string => {
  if (!path) {
    return "/placeholder-product.png";
  }

  if (path.startsWith("http")) {
    return path;
  }

  const base = baseUrl.replace(/\/$/, "");
  const normalized = path.replace(/^\//, "");
  return base ? `${base}/${normalized}` : `/${normalized}`;
};
