export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface Course {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image: string;
  category: 'iot' | 'robotics' | 'ai' | 'programming';
  type: 'kids' | 'adults' | 'bootcamp';
  duration: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export interface Service {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  features: Record<string, string[]>;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: Record<string, string>;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  content: Record<string, any>;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}