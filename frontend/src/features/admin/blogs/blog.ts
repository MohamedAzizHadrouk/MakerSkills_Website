export interface Blog {
  _id: string;
  title: string;
  slug?: string;
  cover: string;
  images?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogDto {
  title: string;
  cover?: string;
  images?: string[];
  description?: string;
}

export interface UpdateBlogDto {
  title?: string;
  cover?: string;
  images?: string[];
  description?: string;
}
