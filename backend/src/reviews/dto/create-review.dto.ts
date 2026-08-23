import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  posteActuelle?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  stars: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
