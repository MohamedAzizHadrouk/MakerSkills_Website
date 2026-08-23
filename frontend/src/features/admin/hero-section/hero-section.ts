export interface HeroButton {
  name: string;
  action: string;
}

export interface HeroSection {
  _id: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  buttons?: HeroButton[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHeroSectionDto {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  buttons?: HeroButton[];
}

export interface UpdateHeroSectionDto {
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttons?: HeroButton[];
}
