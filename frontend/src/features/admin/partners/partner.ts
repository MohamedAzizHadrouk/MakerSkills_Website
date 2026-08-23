export interface Partner {
  _id: string;
  name: string;
  specialite: string;
  logo?: string;
  website?: string;
}

export interface CreatePartnerDto {
  name: string;
  specialite: string;
  logo?: string;
  website?: string;
}

export interface UpdatePartnerDto {
  name?: string;
  specialite?: string;
  logo?: string;
  website?: string;
}
