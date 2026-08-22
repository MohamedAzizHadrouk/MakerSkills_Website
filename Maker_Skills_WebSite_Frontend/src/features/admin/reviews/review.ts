export interface Review {
  _id: string;
  fullName: string;
  image?: string;
  posteActuelle?: string;
  stars: number;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewDto {
  fullName: string;
  image?: string;
  posteActuelle?: string;
  stars: number;
  message: string;
}

export interface UpdateReviewDto {
  fullName?: string;
  image?: string;
  posteActuelle?: string;
  stars?: number;
  message?: string;
}
