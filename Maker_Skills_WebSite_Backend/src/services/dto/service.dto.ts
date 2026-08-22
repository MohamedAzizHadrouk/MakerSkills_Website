import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsUrl,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Embedded System Consultation',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Professional consultation for embedded systems design',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of category IDs',
    example: ['64c9e4e5a88f3f001f7d8a9a', '64c9e4e5a88f3f001f7d8a9b'],
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value : (value as string).split(',');
  })
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Related projects',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value : (value as string).split(',');
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  projects?: string[];

  @ApiProperty({
    description: 'Related products',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value : (value as string).split(',');
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  products?: string[];

  @ApiProperty({
    description: 'Related events',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return [];
    return Array.isArray(value) ? value : (value as string).split(',');
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  events?: string[];

  @ApiProperty({
    description: 'Service price in USD',
    example: 199.99,
    required: false,
  })
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : Number(value),
  )
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Estimated service duration',
    example: '2 weeks',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Service provider information',
    example: 'Embedded Systems Lab',
    required: false,
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    description: 'Service image URL',
    example: 'https://example.com/service-image.jpg',
    required: false,
  })
  @ValidateIf(({ imageUrl }) => imageUrl !== undefined && imageUrl !== '')
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Relative path of the uploaded service image',
    example: '/uploads/services/abc123.jpg',
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Whether the service is active',
    example: true,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Advanced Embedded System Consultation',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Updated professional consultation for embedded systems',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of category IDs',
    example: ['64c9e4e5a88f3f001f7d8a9a', '64c9e4e5a88f3f001f7d8a9c'],
    type: [String],
    required: false,
  })
  @ValidateIf((o) => o.categories !== undefined)
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : (value as string).split(',');
  })
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1, { message: 'Cannot update to empty categories array' })
  categories?: string[];

  @ApiProperty({
    description: 'Related projects',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsOptional()
  projects?: string[];

  @ApiProperty({
    description: 'Related products',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsOptional()
  products?: string[];

  @ApiProperty({
    description: 'Related events',
    type: [String],
    required: false,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsOptional()
  events?: string[];

  @ApiProperty({
    description: 'Service price in USD',
    example: 249.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Estimated service duration',
    example: '3 weeks',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Service provider information',
    example: 'Embedded Systems Lab (Premium)',
    required: false,
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({
    description: 'Relative path of the uploaded service image',
    example: '/uploads/services/abc123.jpg',
  })
  @IsString()
  @IsOptional()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Whether the service is active',
    example: false,
    required: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === 1 || value === '1';
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ServiceResponseDto {
  @ApiProperty({
    description: 'Service ID',
    example: '64c9e4e5a88f3f001f7d8a9d',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the service',
    example: 'Embedded System Consultation',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed service description',
    example: 'Professional consultation for embedded systems design',
  })
  description: string;

  @ApiProperty({
    description: 'Array of category details',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '64c9e4e5a88f3f001f7d8a9a' },
        name: { type: 'string', example: 'Consultation' },
      },
    },
  })
  categories: Array<{ id: string; name: string }>;

  @ApiProperty({
    description: 'Service price in USD',
    example: 199.99,
  })
  price: number;

  @ApiProperty({
    description: 'Estimated service duration',
    example: '2 weeks',
  })
  duration: string;

  @ApiProperty({
    description: 'Service provider information',
    example: 'Embedded Systems Lab',
  })
  provider: string;

  @ApiProperty({
    description: 'Service image URL',
    example: 'https://example.com/service-image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Whether the service is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-08-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-08-05T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class AddCategoriesDto {
  @ApiProperty({
    description: 'Array of category IDs to add',
    example: ['64c9e4e5a88f3f001f7d8a9a', '64c9e4e5a88f3f001f7d8a9b'],
    type: [String],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  categories: string[];
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New active status',
    example: true,
    required: true,
  })
  @IsBoolean()
  isActive: boolean;
}
