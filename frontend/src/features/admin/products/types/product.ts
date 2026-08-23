

export interface Event {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  type?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  category: string | { _id: string; name: string } | null;
  images?: string[];
  video?: string; // Chemin vers le fichier vidéo
  createdAt?: string;
  updatedAt?: string;
  events?: (Event | string)[];
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  category: string;
  images?: string[];
  events?: string[];
  video?: string; // Chemin vers le fichier vidéo
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: string[];
  events?: string[];
  video?: string; // Chemin vers le fichier vidéo
}
