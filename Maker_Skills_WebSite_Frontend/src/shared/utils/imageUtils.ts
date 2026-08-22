const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getProductImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return "/placeholder-product.png";
  }

  // Si l'image commence déjà par http, c'est une URL complète
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Sinon, on combine avec l'URL de base
  return `${API_BASE_URL}/${imagePath.replace(/^\//, "")}`;
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

  return `${baseUrl}/${path.replace(/^\//, "")}`;
};
