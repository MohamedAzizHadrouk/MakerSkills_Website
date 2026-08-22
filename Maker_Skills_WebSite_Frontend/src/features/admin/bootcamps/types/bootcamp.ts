export interface Bootcamp {
  _id: string;
  name: string;
  slug?: string;
  category: string | { _id: string; name: string };
  types: string[];
  description?: string;
  images?: string[];
  dateDebut: string;
  dateFin: string;
  periode?: string;
  location: string;
  price: string;
  animator: string;
  participants?: string[] | { _id: string; name: string }[];
  products?: string[] | { _id: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBootcampDto {
  name: string;
  category: string;
  types: string[];
  description?: string;
  images?: string[];
  dateDebut: string;
  dateFin: string;
  periode?: string;
  location: string;
  price: string;
  animator: string;
  products?: any;
}

export interface UpdateBootcampDto {
  name?: string;
  category?: string;
  types?: string[];
  description?: string;
  images?: string[];
  dateDebut?: string;
  dateFin?: string;
  periode?: string;
  location?: string;
  price?: string;
  animator?: string;
  participants?: string[];
  products?: string[];
}
