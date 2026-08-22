import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsMongoId,
  Min,
  ValidateIf,
} from 'class-validator';
import { MaterialStatus } from '../entities/material.entity';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'Name of the material',
    example: 'Imprimante 3D Ultimaker',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed material description',
    example: 'Imprimante 3D professionnelle avec lit chauffant',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of material',
    example: 'Imprimante 3D',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Hourly rate in TND (if not free)',
    example: 25.0,
    required: false,
  })
  @ValidateIf((o) => !o.isFree)
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @ApiProperty({
    description: 'Whether the material is free to use',
    example: false,
    required: true,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  @IsBoolean()
  @IsNotEmpty()
  isFree: boolean;

  @ApiProperty({
    description: 'Status of the material',
    enum: MaterialStatus,
    example: MaterialStatus.AVAILABLE,
    required: true,
  })
  @IsEnum(MaterialStatus)
  @IsNotEmpty()
  status: MaterialStatus;

  @ApiProperty({
    description: 'Material cover image relative path',
    example: '/uploads/materials/abc123.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Material image URL',
    example: 'https://example.com/material-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Laboratory ID this material belongs to',
    example: '64c9e4e5a88f3f001f7d8a9a',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  laboratoryId: string;
}

export class UpdateMaterialDto {
  @ApiProperty({
    description: 'Name of the material',
    example: 'Imprimante 3D Ultimaker Pro',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Detailed material description',
    example: 'Imprimante 3D professionnelle avec lit chauffant et double extrudeur',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Type of material',
    example: 'Imprimante 3D',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Hourly rate in TND (if not free)',
    example: 30.0,
    required: false,
  })
  @ValidateIf((o) => !o.isFree)
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @ApiProperty({
    description: 'Whether the material is free to use',
    example: false,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiProperty({
    description: 'Status of the material',
    enum: MaterialStatus,
    example: MaterialStatus.AVAILABLE,
    required: false,
  })
  @IsEnum(MaterialStatus)
  @IsOptional()
  status?: MaterialStatus;

  @ApiProperty({
    description: 'Material cover image relative path',
    example: '/uploads/materials/abc123.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Material image URL',
    example: 'https://example.com/material-image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

