import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
} from 'class-validator';

@Schema({ timestamps: true, strict: true })
class ModuleItem {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items: string[];
}

class Instructor {
  @ApiProperty()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  experienceYears: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  studentsCount: number;
}

@Schema({ timestamps: true })
export class Event {
  @ApiProperty({ type: [ModuleItem] })
  @Prop({ type: [{ title: String, items: [String] }] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleItem)
  modules?: ModuleItem[];

  @ApiProperty({ type: Instructor })
  @Prop({
    type: {
      photoUrl: String,
      name: String,
      title: String,
      experienceYears: Number,
      studentsCount: Number,
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Instructor)
  instructor?: Instructor;

  @ApiProperty({ enum: ['workshop', 'bootcamp', 'event', 'course'] })
  @Prop({ required: true, enum: ['workshop', 'bootcamp', 'event', 'course'] })
  @IsString()
  type: 'workshop' | 'bootcamp' | 'event' | 'course';

  @ApiProperty()
  @Prop({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly identifier auto-generated from name' })
  @Prop({ unique: true, sparse: true, index: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ type: [String], description: 'Previous slugs for redirects after rename' })
  @Prop({ type: [String], default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  previousSlugs?: string[];

  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsNumber()
  reduction?: number;

  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsString()
  duration?: string;

  // Changed from startDate to dateDebut to match payload
  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsDateString()
  dateDebut?: Date;

  // Added periode field from payload
  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsString()
  periode?: string;

  // Added animator field from payload
  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsString()
  animator?: string;

  @ApiProperty({ type: [String] })
  @Prop({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  required?: string[];

  @ApiProperty({ type: [String] })
  @Prop({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includedInEvent?: string[];

  @ApiProperty({ type: [String] })
  @Prop({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  objectives?: string[];

  @ApiProperty({ enum: ['online', 'in_person', 'hybrid'] })
  @Prop({ enum: ['online', 'in_person', 'hybrid'], default: 'online' })
  @IsOptional()
  @IsString()
  location?: 'online' | 'in_person' | 'hybrid';

  @ApiProperty()
  @Prop({ default: false })
  @IsOptional()
  @IsBoolean()
  certification?: boolean;

  @ApiProperty({ type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  products?: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @Prop({ required: true })
  @IsString()
  coverImage: string;

  @ApiProperty()
  @Prop({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  @Prop({ type: [Types.ObjectId], ref: 'Participant', default: [] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  participants?: Types.ObjectId[];

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  @IsOptional()
  @IsMongoId()
  category?: Types.ObjectId;
}

export type EventDocument = Event & Document;
export const EventSchema = SchemaFactory.createForClass(Event);