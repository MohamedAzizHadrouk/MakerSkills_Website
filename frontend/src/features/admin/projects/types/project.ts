export interface Project {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  technologies: string[];
  categories: string[] | any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  coverImage: string;
  technologies: string[];
  categories: string[];
}
