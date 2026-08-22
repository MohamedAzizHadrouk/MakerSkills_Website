const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3020";

export const getBootcampImageUrl = (imagePath: string): string => {
  if (!imagePath) return "/placeholder-bootcamp.png";

  // Si c'est déjà une URL complète
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Si c'est un chemin relatif, ajouter le BASE_URL
  return `${BASE_URL}${imagePath}`;
};
