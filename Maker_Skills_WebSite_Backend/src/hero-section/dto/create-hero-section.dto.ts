import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class HeroButtonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  action: string;
}

export class CreateHeroSectionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsOptional()
  buttons?: string;
}
