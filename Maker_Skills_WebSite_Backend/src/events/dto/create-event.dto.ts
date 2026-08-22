import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  participants?: string[];
}
