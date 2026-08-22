import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateLaboratoryDto {
  @ApiProperty({
    description: 'Title of the laboratory',
    example: 'Laboratoire d\'Impression 3D',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed laboratory description',
    example: 'Laboratoire équipé pour l\'impression 3D et la prototypage',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Laboratory image URL',
    example: 'https://example.com/laboratory-image.jpg',
    required: false,
  })
  @ValidateIf(({ imageUrl }) => imageUrl !== undefined && imageUrl !== '')
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Relative path of the uploaded laboratory image',
    example: '/uploads/laboratories/abc123.jpg',
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Hourly rate in TND',
    example: 50.0,
    required: true,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === '' || value === null) {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber({}, { message: 'hourlyRate must be a valid number' })
  @Min(0, { message: 'hourlyRate must be greater than or equal to 0' })
  @IsNotEmpty({ message: 'hourlyRate is required' })
  hourlyRate: number;
}

export class UpdateLaboratoryDto {
  @ApiProperty({
    description: 'Title of the laboratory',
    example: 'Laboratoire d\'Impression 3D Avancé',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Detailed laboratory description',
    example: 'Laboratoire équipé pour l\'impression 3D et la prototypage avancé',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Laboratory image URL',
    example: 'https://example.com/updated-laboratory-image.jpg',
    required: false,
  })
  @ValidateIf(({ imageUrl }) => imageUrl !== undefined && imageUrl !== '')
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Relative path of the uploaded laboratory image',
    example: '/uploads/laboratories/abc123.jpg',
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Hourly rate in TND',
    example: 60.0,
    required: false,
  })
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;
}

