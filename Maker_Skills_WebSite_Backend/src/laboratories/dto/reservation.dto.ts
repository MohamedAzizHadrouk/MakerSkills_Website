import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateLaboratoryReservationDto {
  @ApiProperty({
    description: 'Full name of the person making the reservation',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email of the person making the reservation',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the person making the reservation',
    example: '+216 12 345 678',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'List of material IDs selected for this reservation',
    type: [String],
    example: ['64c9e4e5a88f3f001f7d8a9b', '64c9e4e5a88f3f001f7d8a9c'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  materials?: string[];

  @ApiProperty({
    description: 'Date of the reservation (YYYY-MM-DD)',
    example: '2024-01-15',
  })
  @IsDateString()
  reservationDate: string;

  @ApiProperty({
    description: 'Start time of the reservation (HH:mm)',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the reservation (HH:mm)',
    example: '17:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Optional notes or additional information',
    example: 'Need assistance with 3D printing setup',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLaboratoryReservationDto {
  @ApiProperty({
    description: 'Status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiProperty({
    description: 'Total cost of the reservation in TND',
    example: 250.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @ApiProperty({
    description: 'Optional notes or additional information',
    example: 'Updated notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}


