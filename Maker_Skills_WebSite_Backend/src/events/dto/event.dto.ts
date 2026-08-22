import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsMongoId,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

class ModuleItemDto {
  @ApiPropertyOptional({
    description: 'Title of the module',
    example: 'Introduction to Programming',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Items in the module',
    example: ['Basic Syntax', 'Variables'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items: string[];
}

class InstructorDto {
  @ApiPropertyOptional({
    description: 'URL of instructor photo',
    example: 'https://example.com/instructor.jpg',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Name of the instructor',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Title/position of the instructor',
    example: 'Senior Developer',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Years of experience',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  experienceYears: number;

  @ApiPropertyOptional({
    description: 'Number of students taught',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  studentsCount: number;
}

export class CreateEventDto {
  @ApiPropertyOptional({
    description: 'Event modules',
    type: [ModuleItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleItemDto)
  modules: ModuleItemDto[];

  @ApiPropertyOptional({
    description: 'Event instructor details',
    type: InstructorDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InstructorDto)
  instructor: InstructorDto;

  @ApiPropertyOptional({
    description: 'Type of event',
    enum: ['workshop', 'bootcamp', 'event', 'course'],
    example: 'workshop',
  })
  @IsOptional()
  @IsString()
  type: 'workshop' | 'bootcamp' | 'event' | 'course';

  @ApiProperty({
    description: 'Name of the event',
    example: 'Advanced JavaScript Workshop',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Name of the event',
    example: 'Advanced JavaScript Workshop',
    required: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the event',
    example: 99.99,
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'Price reduction/discount',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  reduction: number;

  @ApiPropertyOptional({
    description: 'Duration of the event',
    example: '2 days',
  })
  @IsOptional()
  @IsString()
  duration: string;

  @ApiPropertyOptional({
    description: 'Start date of the event',
    example: '2023-12-15T09:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Requirements for participants',
    example: ['Laptop', 'Basic JavaScript knowledge'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required: string[];

  @ApiPropertyOptional({
    description: 'What is included in the event',
    example: ['Materials', 'Lunch'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedInEvent: string[];

  @ApiPropertyOptional({
    description: 'Learning objectives',
    example: ['Master advanced concepts', 'Build real projects'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objectives: string[];

  @ApiPropertyOptional({
    description: 'Location type',
    enum: ['online', 'in_person'],
    example: 'in_person',
  })
  @IsOptional()
  @IsString()
  location: 'online' | 'in_person';

  @ApiPropertyOptional({
    description: 'Whether certification is provided',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  certification: boolean;

  @ApiPropertyOptional({
    description: 'Related product IDs',
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products: string[];

  @ApiPropertyOptional({
    description: 'Physical address for in-person events',
    example: '123 Main St, New York, NY',
  })
  @IsOptional()
  @IsString()
  address: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Event modules',
    type: [ModuleItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleItemDto)
  modules?: ModuleItemDto[];

  @ApiPropertyOptional({
    description: 'Event instructor details',
    type: InstructorDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InstructorDto)
  instructor?: InstructorDto;

  @ApiPropertyOptional({
    description: 'Type of event',
    enum: ['workshop', 'bootcamp', 'event', 'course'],
    example: 'workshop',
  })
  @IsOptional()
  @IsString()
  type?: 'workshop' | 'bootcamp' | 'event' | 'course';

  @ApiPropertyOptional({
    description: 'Name of the event',
    example: 'Advanced JavaScript Workshop',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Price of the event',
    example: 99.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Price reduction/discount',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  reduction?: number;

  @ApiPropertyOptional({
    description: 'Duration of the event',
    example: '2 days',
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    description: 'Start date of the event',
    example: '2023-12-15T09:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Requirements for participants',
    example: ['Laptop', 'Basic JavaScript knowledge'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @ApiPropertyOptional({
    description: 'What is included in the event',
    example: ['Materials', 'Lunch'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedInEvent?: string[];

  @ApiPropertyOptional({
    description: 'Learning objectives',
    example: ['Master advanced concepts', 'Build real projects'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objectives?: string[];

  @ApiPropertyOptional({
    description: 'Location type',
    enum: ['online', 'in_person'],
    example: 'in_person',
  })
  @IsOptional()
  @IsString()
  location?: 'online' | 'in_person';

  @ApiPropertyOptional({
    description: 'Whether certification is provided',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  certification?: boolean;

  @ApiPropertyOptional({
    description: 'Related product IDs',
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products?: string[];

  @ApiPropertyOptional({
    description: 'Physical address for in-person events',
    example: '123 Main St, New York, NY',
  })
  @IsOptional()
  @IsString()
  address?: string;
}

export class EventResponseDto {
  @ApiProperty({
    description: 'Event ID',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the event',
    example: 'Advanced JavaScript Workshop',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Event modules',
    type: [ModuleItemDto],
  })
  modules?: ModuleItemDto[];

  @ApiPropertyOptional({
    description: 'Event instructor details',
    type: InstructorDto,
  })
  instructor?: InstructorDto;

  @ApiPropertyOptional({
    description: 'Type of event',
    enum: ['workshop', 'bootcamp', 'event', 'course'],
    example: 'workshop',
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'Price of the event',
    example: 99.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Price reduction/discount',
    example: 20,
  })
  reduction?: number;

  @ApiPropertyOptional({
    description: 'Duration of the event',
    example: '2 days',
  })
  duration?: string;

  @ApiPropertyOptional({
    description: 'Start date of the event',
    example: '2023-12-15T09:00:00Z',
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Requirements for participants',
    example: ['Laptop', 'Basic JavaScript knowledge'],
    type: [String],
  })
  required?: string[];

  @ApiPropertyOptional({
    description: 'What is included in the event',
    example: ['Materials', 'Lunch'],
    type: [String],
  })
  includedInEvent?: string[];

  @ApiPropertyOptional({
    description: 'Learning objectives',
    example: ['Master advanced concepts', 'Build real projects'],
    type: [String],
  })
  objectives?: string[];

  @ApiPropertyOptional({
    description: 'Location type',
    enum: ['online', 'in_person'],
    example: 'in_person',
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'Whether certification is provided',
    example: false,
  })
  certification?: boolean;

  @ApiPropertyOptional({
    description: 'Related product IDs',
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  products?: string[];

  @ApiPropertyOptional({
    description: 'Physical address for in-person events',
    example: '123 Main St, New York, NY',
  })
  address?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-10-05T14:30:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Categories associated with the event',
    example: ['507f1f77bcf86cd799439011'],
    type: [String],
  })
  category: string[];
}
