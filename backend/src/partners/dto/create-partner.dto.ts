import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  specialite: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsUrl()
  @IsOptional()
  website?: string;
}
