import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsUrl,
  IsBoolean,
  Min,
  Max,
  IsIn,
  IsMongoId,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // Make coverImage optional since you're uploading a file separately
  coverImage?: string;

  // Parse the stringified array

  @IsString()
  technologies: string;

  @IsString()
  @IsNotEmpty()
  categories?: string;
}
