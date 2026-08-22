import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Laboratory } from './laboratory.entity';
import { Material } from './material.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class LaboratoryReservation extends Document {
  @ApiProperty({
    description: 'Full name of the person making the reservation',
    example: 'John Doe',
    required: true,
  })
  @Prop({ required: true })
  fullName: string;

  @ApiProperty({
    description: 'Email of the person making the reservation',
    example: 'john.doe@example.com',
    required: true,
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    description: 'Phone number of the person making the reservation',
    example: '+216 12 345 678',
    required: true,
  })
  @Prop({ required: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Reference to the laboratory being reserved',
    type: String,
    example: '64c9e4e5a88f3f001f7d8a9a',
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: 'Laboratory', required: true })
  laboratoryId: Laboratory | Types.ObjectId;

  @ApiProperty({
    description: 'List of material IDs selected for this reservation',
    type: [String],
    example: ['64c9e4e5a88f3f001f7d8a9b', '64c9e4e5a88f3f001f7d8a9c'],
    required: false,
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Material' }], default: [] })
  materials: (Material | Types.ObjectId)[];

  @ApiProperty({
    description: 'Date of the reservation',
    example: '2024-01-15',
    required: true,
  })
  @Prop({ required: true, type: Date })
  reservationDate: Date;

  @ApiProperty({
    description: 'Start time of the reservation',
    example: '09:00',
    required: true,
  })
  @Prop({ required: true })
  startTime: string;

  @ApiProperty({
    description: 'End time of the reservation',
    example: '17:00',
    required: true,
  })
  @Prop({ required: true })
  endTime: string;

  @ApiProperty({
    description: 'Optional notes or additional information',
    example: 'Need assistance with 3D printing setup',
    required: false,
  })
  @Prop()
  notes?: string;

  @ApiProperty({
    description: 'Total cost of the reservation in TND',
    example: 250.0,
    required: false,
  })
  @Prop({ type: Number })
  totalCost?: number;

  @ApiProperty({
    description: 'Status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
    required: false,
  })
  @Prop({
    type: String,
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  updatedAt: Date;
}

export const LaboratoryReservationSchema =
  SchemaFactory.createForClass(LaboratoryReservation);


