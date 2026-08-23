import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString() // Since client sends stringified JSON
  technologies?: string;

  @IsOptional()
  @IsString() // Since client sends stringified JSON
  categories?: string;
}