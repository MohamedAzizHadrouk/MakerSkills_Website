import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum MaterialStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class Material extends Document {
  @ApiProperty({
    description: 'Name of the material',
    example: 'Imprimante 3D Ultimaker',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Detailed material description',
    example: 'Imprimante 3D professionnelle avec lit chauffant',
    required: false,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Type of material',
    example: 'Imprimante 3D',
    required: true,
  })
  @Prop({ required: true })
  type: string;

  @ApiProperty({
    description: 'Hourly rate in TND (if not free)',
    example: 25.0,
    required: false,
  })
  @Prop({ type: Number })
  hourlyRate?: number;

  @ApiProperty({
    description: 'Whether the material is free to use',
    example: false,
    required: true,
  })
  @Prop({ required: true, default: false })
  isFree: boolean;

  @ApiProperty({
    description: 'Status of the material',
    enum: MaterialStatus,
    example: MaterialStatus.AVAILABLE,
    required: true,
  })
  @Prop({
    type: String,
    enum: MaterialStatus,
    default: MaterialStatus.AVAILABLE,
    required: true,
  })
  status: MaterialStatus;

  @ApiProperty({
    description: 'Material cover image relative path',
    example: '/uploads/materials/abc123.jpg',
    required: false,
  })
  @Prop()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Material image URL',
    example: 'https://example.com/material-image.jpg',
    required: false,
  })
  @Prop()
  imageUrl?: string;

  @ApiProperty({
    description: 'Laboratory ID this material belongs to',
    example: '64c9e4e5a88f3f001f7d8a9a',
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: 'Laboratory', required: true })
  laboratoryId: Types.ObjectId;

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

export const MaterialSchema = SchemaFactory.createForClass(Material);

