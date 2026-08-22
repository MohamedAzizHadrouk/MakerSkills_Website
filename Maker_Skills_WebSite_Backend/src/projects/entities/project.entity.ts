import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';

/**
 * Embedded Systems Project Entity for Factory Lab Website
 */
@Schema({ timestamps: true })
export class Project extends Document {
  @ApiProperty({
    description: 'Name of the embedded systems project',
    example: 'Smart Factory Monitoring System',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Detailed technical description',
    example: 'ARM Cortex-M4 based monitoring system with LoRaWAN connectivity',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Main project image URL',
    example: '/assets/projects/smart-factory-cover.jpg',
  })
  @Prop({ required: true })
  coverImage: string;

  @ApiProperty({
    description: 'Main technologies used',
    example: ['STM32', 'FreeRTOS', 'LoRaWAN', 'Modbus'],
    type: [String],
  })
  @Prop({ type: [String], required: true })
  technologies?: string[];

  @ApiProperty({
    description: 'Project categories',
    example: ['IoT', 'Industrial', 'Monitoring'],
    type: [String],
  })
  @Prop({ type: [Types.ObjectId], ref: 'Category', required: true })
  categories?: Category[] | Types.ObjectId[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
