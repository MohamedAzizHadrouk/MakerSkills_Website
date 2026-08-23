import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Laboratory extends Document {
  @ApiProperty({
    description: 'Title of the laboratory',
    example: 'Laboratoire d\'Impression 3D',
    required: true,
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'URL-friendly identifier auto-generated from title',
    example: 'laboratoire-impression-3d',
    required: false,
  })
  @Prop({ unique: true, sparse: true, index: true })
  slug?: string;

  @ApiProperty({
    description: 'Previous slugs for redirects after rename',
    type: [String],
    required: false,
  })
  @Prop({ type: [String], default: [] })
  previousSlugs?: string[];

  @ApiProperty({
    description: 'Detailed laboratory description',
    example: 'Laboratoire équipé pour l\'impression 3D et la prototypage',
    required: false,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Laboratory cover image relative path',
    example: '/uploads/laboratories/abc123.jpg',
    required: false,
  })
  @Prop()
  coverImagePath?: string;

  @ApiProperty({
    description: 'Laboratory image URL',
    example: 'https://example.com/laboratory-image.jpg',
    required: false,
  })
  @Prop()
  imageUrl?: string;

  @ApiProperty({
    description: 'Hourly rate in TND',
    example: 50.0,
    required: true,
  })
  @Prop({ required: true, type: Number })
  hourlyRate: number;

  @ApiProperty({
    description: 'Materials available in this laboratory',
    type: [String],
    required: false,
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Material' }] })
  materials?: Types.ObjectId[];

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

export const LaboratorySchema = SchemaFactory.createForClass(Laboratory);

